from django.urls import path

from .views import MyPayslipListView, PayrollDetailView, PayrollListCreateView, PayslipPdfView, ProcessPayrollView

urlpatterns = [
    path('', PayrollListCreateView.as_view(), name='payroll-list'),
    path('mine/', MyPayslipListView.as_view(), name='my-payslips'),
    path('<int:pk>/pdf/', PayslipPdfView.as_view(), name='payslip-pdf'),
    path('<int:pk>/', PayrollDetailView.as_view(), name='payroll-detail'),
    path('<int:pk>/process/', ProcessPayrollView.as_view(), name='process-payroll'),
]
