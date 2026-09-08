from rest_framework.permissions import BasePermission

from .models import User


class IsRoleAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.ADMIN)


class IsApprovedEmployee(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.EMPLOYEE and request.user.approval_status == User.ApprovalStatus.APPROVED)
