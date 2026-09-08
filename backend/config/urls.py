from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok', 'service': 'employee-management-api'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health, name='health'),
    path('api/auth/', include('accounts.urls')),
    path('api/departments/', include('departments.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/leaves/', include('leaves.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/announcements/', include('announcements.urls')),
    path('api/payroll/', include('payroll.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]
