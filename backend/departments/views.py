from django.db.models import Count
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsRoleAdmin

from .models import Department
from .serializers import DepartmentSerializer


class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.annotate(employee_count=Count('employees'))
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsRoleAdmin()]
        return [IsAuthenticated()]


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.annotate(employee_count=Count('employees'))
    serializer_class = DepartmentSerializer
    permission_classes = [IsRoleAdmin]
