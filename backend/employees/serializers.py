from rest_framework import serializers

from accounts.models import EmployeeProfile, User
from departments.models import Department


class EmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False)
    employee_id = serializers.CharField(source='employee_profile.employee_id', read_only=True)
    salary = serializers.DecimalField(source='employee_profile.salary', max_digits=12, decimal_places=2)
    joining_date = serializers.DateField(source='employee_profile.joining_date', required=False, allow_null=True)
    department_id = serializers.PrimaryKeyRelatedField(source='employee_profile.department', queryset=Department.objects.all(), required=False, allow_null=True)
    status = serializers.CharField(source='approval_status', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'employee_id', 'username', 'email', 'first_name', 'last_name', 'phone', 'date_of_birth', 'experience_years', 'department_id', 'salary', 'joining_date', 'password', 'status')
        read_only_fields = ('id', 'employee_id', 'status')

    def create(self, validated_data):
        profile_data = validated_data.pop('employee_profile', {})
        password = validated_data.pop('password', None)
        user = User(**validated_data, role=User.Role.EMPLOYEE, approval_status=User.ApprovalStatus.APPROVED, is_active=True)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        profile = user.employee_profile = EmployeeProfile.objects.create(user=user, employee_id=f'EMP-{user.pk:05d}')
        for field, value in profile_data.items():
            setattr(profile, field, value)
        profile.save()
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('employee_profile', {})
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        for field, value in profile_data.items():
            setattr(instance.employee_profile, field, value)
        instance.employee_profile.save()
        return instance
