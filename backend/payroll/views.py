from io import BytesIO

from django.http import FileResponse
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsApprovedEmployee, IsRoleAdmin

from .models import Payroll
from .serializers import PayrollSerializer


class PayrollListCreateView(generics.ListCreateAPIView):
    serializer_class = PayrollSerializer
    permission_classes = [IsRoleAdmin]
    queryset = Payroll.objects.select_related('employee', 'employee__employee_profile')


class PayrollDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = PayrollSerializer
    permission_classes = [IsRoleAdmin]
    queryset = Payroll.objects.select_related('employee', 'employee__employee_profile')


class MyPayslipListView(generics.ListAPIView):
    serializer_class = PayrollSerializer
    queryset = Payroll.objects.select_related('employee', 'employee__employee_profile')

    def get_queryset(self):
        return self.queryset.filter(employee=self.request.user)


class ProcessPayrollView(APIView):
    permission_classes = [IsRoleAdmin]

    def post(self, request, pk):
        try:
            payroll = Payroll.objects.get(pk=pk)
        except Payroll.DoesNotExist:
            return Response({'detail': 'Payroll record not found.'}, status=status.HTTP_404_NOT_FOUND)
        if payroll.status == Payroll.Status.PAID:
            return Response({'detail': 'Payroll has already been processed.'}, status=status.HTTP_400_BAD_REQUEST)
        payroll.status = Payroll.Status.PAID
        payroll.processed_at = timezone.now()
        payroll.save(update_fields=('status', 'processed_at', 'net_salary'))
        return Response(PayrollSerializer(payroll).data)


class PayslipPdfView(APIView):
    permission_classes = [IsApprovedEmployee]

    def get(self, request, pk):
        try:
            payroll = Payroll.objects.select_related('employee', 'employee__employee_profile', 'employee__employee_profile__department').get(pk=pk, employee=request.user)
        except Payroll.DoesNotExist:
            return Response({'detail': 'Payslip not found.'}, status=status.HTTP_404_NOT_FOUND)

        profile = payroll.employee.employee_profile
        employee_name = payroll.employee.get_full_name() or payroll.employee.username
        department = profile.department.name if profile.department else 'Unassigned'
        buffer = BytesIO()
        document = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=48, leftMargin=48, topMargin=48, bottomMargin=48)
        styles = getSampleStyleSheet()
        story = [Paragraph('PEOPLEOS', styles['Title']), Paragraph('Official Payslip', styles['Heading2']), Spacer(1, 20)]
        details = [
            ['Employee', employee_name, 'Employee ID', profile.employee_id],
            ['Department', department, 'Pay period', f'{payroll.pay_period_start} to {payroll.pay_period_end}'],
            ['Payment status', payroll.get_status_display(), 'Generated', timezone.localdate().isoformat()],
        ]
        table = Table(details, colWidths=[90, 160, 90, 160])
        table.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#d9e4e1')), ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eef5f3')), ('PADDING', (0, 0), (-1, -1), 8)]))
        story.extend([table, Spacer(1, 24)])
        earnings = Table([['Description', 'Amount'], ['Basic salary', f'${payroll.basic_salary:,.2f}'], ['Allowances', f'${payroll.allowances:,.2f}'], ['Deductions', f'-${payroll.deductions:,.2f}'], ['Net salary', f'${payroll.net_salary:,.2f}']], colWidths=[360, 140])
        earnings.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#d9e4e1')), ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#12343b')), ('TEXTCOLOR', (0, 0), (-1, 0), colors.white), ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#e4f1ed')), ('ALIGN', (1, 0), (1, -1), 'RIGHT'), ('PADDING', (0, 0), (-1, -1), 9)]))
        story.extend([earnings, Spacer(1, 20), Paragraph('This is a computer-generated payslip and does not require a signature.', styles['Normal'])])
        document.build(story)
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f'payslip_{payroll.employee.username}_{payroll.pay_period_end}.pdf', content_type='application/pdf')
