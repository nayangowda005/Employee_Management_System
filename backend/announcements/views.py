from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsRoleAdmin

from .models import Announcement
from .serializers import AnnouncementSerializer


class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.select_related('created_by')
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsRoleAdmin()]
        return [IsAuthenticated()]


class AnnouncementDetailView(generics.RetrieveDestroyAPIView):
    queryset = Announcement.objects.select_related('created_by')
    serializer_class = AnnouncementSerializer
    permission_classes = [IsRoleAdmin]
