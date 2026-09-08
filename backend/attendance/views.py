from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsApprovedEmployee, IsRoleAdmin

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Attendance.objects.select_related('employee')
        if self.request.user.role == User.Role.ADMIN:
            return queryset
        return queryset.filter(employee=self.request.user)


class ClockActionView(APIView):
    permission_classes = [IsApprovedEmployee]

    def post(self, request, action):
        today = timezone.localdate()
        now = timezone.now()
        if action == 'in':
            record, created = Attendance.objects.get_or_create(employee=request.user, date=today)
            if record.clock_in:
                return Response({'detail': 'You have already clocked in today.'}, status=status.HTTP_400_BAD_REQUEST)
            record.clock_in = now
            record.save(update_fields=('clock_in',))
            return Response(AttendanceSerializer(record).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        record = Attendance.objects.filter(employee=request.user, date=today).first()
        if not record:
            return Response({'detail': 'Clock in before clocking out.'}, status=status.HTTP_400_BAD_REQUEST)
        if not record.clock_in:
            return Response({'detail': 'Clock in before clocking out.'}, status=status.HTTP_400_BAD_REQUEST)
        if record.clock_out:
            return Response({'detail': 'You have already clocked out today.'}, status=status.HTTP_400_BAD_REQUEST)
        record.clock_out = now
        record.save(update_fields=('clock_out',))
        return Response(AttendanceSerializer(record).data)
