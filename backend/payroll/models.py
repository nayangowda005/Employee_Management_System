from decimal import Decimal

from django.conf import settings
from django.db import models


class Payroll(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'

    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payroll_records')
    pay_period_start = models.DateField()
    pay_period_end = models.DateField()
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-pay_period_end', '-created_at')
        constraints = [models.UniqueConstraint(fields=('employee', 'pay_period_start', 'pay_period_end'), name='unique_employee_pay_period')]

    def save(self, *args, **kwargs):
        basic_salary = Decimal(str(self.basic_salary or 0))
        allowances = Decimal(str(self.allowances or 0))
        deductions = Decimal(str(self.deductions or 0))
        self.net_salary = basic_salary + allowances - deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.employee.username} - {self.pay_period_start} to {self.pay_period_end}'
