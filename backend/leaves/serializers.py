from django.db.models import Q
from rest_framework import serializers

from accounts.models import User

from .models import LeaveRequest


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = LeaveRequest
        fields = ('id', 'employee', 'employee_name', 'start_date', 'end_date', 'reason', 'status', 'created_at', 'reviewed_at')
        read_only_fields = ('employee', 'employee_name', 'status', 'created_at', 'reviewed_at')

    def get_employee_name(self, obj):
        return obj.employee.get_full_name() or obj.employee.username

    def validate(self, attrs):
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError({'end_date': 'End date must be on or after the start date.'})
        employee = self.context['request'].user
        overlapping = LeaveRequest.objects.filter(employee=employee, status__in=[LeaveRequest.Status.PENDING, LeaveRequest.Status.APPROVED]).filter(Q(start_date__lte=attrs['end_date']) & Q(end_date__gte=attrs['start_date']))
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        if overlapping.exists():
            raise serializers.ValidationError('This request overlaps an existing pending or approved leave.')
        return attrs

    def create(self, validated_data):
        return LeaveRequest.objects.create(employee=self.context['request'].user, **validated_data)
