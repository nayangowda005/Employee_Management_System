from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsApprovedEmployee, IsRoleAdmin
from announcements.models import Announcement
from attendance.models import Attendance
from departments.models import Department
from leaves.models import LeaveRequest
from payroll.models import Payroll


class AdminDashboardView(APIView):
    permission_classes = [IsRoleAdmin]

    def get(self, request):
        today = timezone.localdate()
        employees = User.objects.filter(role=User.Role.EMPLOYEE)
        pending_leave = LeaveRequest.objects.filter(status=LeaveRequest.Status.PENDING)
        approved_leaves_today = LeaveRequest.objects.filter(status=LeaveRequest.Status.APPROVED, start_date__lte=today, end_date__gte=today)
        data = {
            'total_employees': employees.count(),
            'employees_on_leave_today': approved_leaves_today.values('employee').distinct().count(),
            'total_departments': Department.objects.count(),
            'pending_employee_approvals': employees.filter(approval_status=User.ApprovalStatus.PENDING).count(),
            'pending_leave_approvals': pending_leave.count(),
            'present_today': Attendance.objects.filter(date=today, clock_in__isnull=False).values('employee').distinct().count(),
            'approved_leaves': LeaveRequest.objects.filter(status=LeaveRequest.Status.APPROVED).count(),
            'pending_payrolls': Payroll.objects.filter(status=Payroll.Status.PENDING).count(),
            'total_announcements': Announcement.objects.count(),
        }
        return Response(data)


class EmployeeDashboardView(APIView):
    permission_classes = [IsApprovedEmployee]

    def get(self, request):
        today = timezone.localdate()
        month_start = today.replace(day=1)
        leaves = LeaveRequest.objects.filter(employee=request.user)
        attendance = Attendance.objects.filter(employee=request.user, date__gte=month_start, date__lte=today, clock_in__isnull=False).count()
        return Response({
            'pending_leave_requests': leaves.filter(status=LeaveRequest.Status.PENDING).count(),
            'approved_leaves': leaves.filter(status=LeaveRequest.Status.APPROVED).count(),
            'rejected_leaves': leaves.filter(status=LeaveRequest.Status.REJECTED).count(),
            'attendance_this_month': attendance,
            'announcements': Announcement.objects.count(),
            'payslips': Payroll.objects.filter(employee=request.user).count(),
        })
