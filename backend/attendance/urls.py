from django.urls import path

from .views import AttendanceListView, ClockActionView

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance-list'),
    path('clock-in/', ClockActionView.as_view(), {'action': 'in'}, name='clock-in'),
    path('clock-out/', ClockActionView.as_view(), {'action': 'out'}, name='clock-out'),
]
