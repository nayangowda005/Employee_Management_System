from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import EmployeeProfile, User


class UserSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee_profile.employee_id', read_only=True)
    department = serializers.CharField(source='employee_profile.department.name', read_only=True, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'approval_status', 'employee_id', 'department')


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirmation = serializers.CharField(write_only=True)
    department_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'phone', 'date_of_birth', 'experience_years', 'department_id', 'password', 'password_confirmation')

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirmation'):
            raise serializers.ValidationError({'password_confirmation': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        department_id = validated_data.pop('department_id', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        EmployeeProfile.objects.create(user=user, employee_id=f'EMP-{user.pk:05d}', department_id=department_id)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        username = attrs.get('username')
        user = authenticate(username=username, password=attrs.get('password'))
        if user is None:
            raise serializers.ValidationError('Invalid username or password.')
        if user.approval_status != User.ApprovalStatus.APPROVED:
            raise serializers.ValidationError(f'Account is {user.approval_status.lower()}.')
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
