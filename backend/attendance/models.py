from django.conf import settings
from django.db import models


class Attendance(models.Model):
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    clock_in = models.DateTimeField(null=True, blank=True)
    clock_out = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ('-date',)
        constraints = [models.UniqueConstraint(fields=('employee', 'date'), name='unique_employee_attendance_day')]

    def __str__(self):
        return f'{self.employee.username} - {self.date}'
