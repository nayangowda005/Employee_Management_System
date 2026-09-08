from django.conf import settings
from django.db import models


class Announcement(models.Model):
    title = models.CharField(max_length=180)
    content = models.TextField()
    announcement_date = models.DateField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='announcements')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-announcement_date', '-created_at')

    def __str__(self):
        return self.title
