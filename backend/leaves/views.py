from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsRoleAdmin

from .models import LeaveRequest
from .serializers import LeaveRequestSerializer


class LeaveListCreateView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = LeaveRequest.objects.select_related('employee')
        if self.request.user.role == User.Role.ADMIN:
            return queryset
        return queryset.filter(employee=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != User.Role.EMPLOYEE or self.request.user.approval_status != User.ApprovalStatus.APPROVED:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only approved employees can apply for leave.')
        serializer.save()


class LeaveReviewView(APIView):
    permission_classes = [IsRoleAdmin]

    def post(self, request, pk, action):
        try:
            leave = LeaveRequest.objects.get(pk=pk)
        except LeaveRequest.DoesNotExist:
            return Response({'detail': 'Leave request not found.'}, status=status.HTTP_404_NOT_FOUND)
        if leave.status != LeaveRequest.Status.PENDING:
            return Response({'detail': 'Only pending requests can be reviewed.'}, status=status.HTTP_400_BAD_REQUEST)
        leave.status = LeaveRequest.Status.APPROVED if action == 'approve' else LeaveRequest.Status.REJECTED
        leave.reviewed_at = timezone.now()
        leave.save(update_fields=('status', 'reviewed_at'))
        return Response(LeaveRequestSerializer(leave).data)
