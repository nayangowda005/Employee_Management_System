from rest_framework import serializers

from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Department
        fields = ('id', 'name', 'description', 'created_at', 'employee_count')
        read_only_fields = ('created_at', 'employee_count')
