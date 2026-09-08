from rest_framework import serializers

from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Announcement
        fields = ('id', 'title', 'content', 'announcement_date', 'created_by', 'created_by_name', 'created_at')
        read_only_fields = ('created_by', 'created_by_name', 'created_at')

    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() or obj.created_by.username

    def create(self, validated_data):
        return Announcement.objects.create(created_by=self.context['request'].user, **validated_data)
