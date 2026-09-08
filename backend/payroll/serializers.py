from rest_framework import serializers

from accounts.models import User

from .models import Payroll


class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    employee_id = serializers.CharField(source='employee.employee_profile.employee_id', read_only=True)

    class Meta:
        model = Payroll
        fields = ('id', 'employee', 'employee_id', 'employee_name', 'pay_period_start', 'pay_period_end', 'basic_salary', 'allowances', 'deductions', 'net_salary', 'status', 'processed_at', 'created_at')
        read_only_fields = ('net_salary', 'status', 'processed_at', 'created_at', 'employee_id', 'employee_name')

    def get_employee_name(self, obj):
        return obj.employee.get_full_name() or obj.employee.username

    def validate(self, attrs):
        if attrs['pay_period_start'] > attrs['pay_period_end']:
            raise serializers.ValidationError({'pay_period_end': 'Pay period end must be on or after the start date.'})
        if attrs.get('deductions', 0) > attrs.get('basic_salary', 0) + attrs.get('allowances', 0):
            raise serializers.ValidationError({'deductions': 'Deductions cannot exceed gross salary.'})
        employee = attrs.get('employee')
        if employee and employee.role != User.Role.EMPLOYEE:
            raise serializers.ValidationError({'employee': 'Payroll can only be created for employees.'})
        return attrs
