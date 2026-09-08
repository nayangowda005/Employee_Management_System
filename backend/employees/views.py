from rest_framework import generics
from accounts.permissions import IsRoleAdmin

from accounts.models import User

from .serializers import EmployeeSerializer


class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.filter(role=User.Role.EMPLOYEE).select_related('employee_profile', 'employee_profile__department')
    serializer_class = EmployeeSerializer
    permission_classes = [IsRoleAdmin]


class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(role=User.Role.EMPLOYEE).select_related('employee_profile', 'employee_profile__department')
    serializer_class = EmployeeSerializer
    permission_classes = [IsRoleAdmin]
