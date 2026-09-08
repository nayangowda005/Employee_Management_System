from django.urls import path

from .views import LeaveListCreateView, LeaveReviewView

urlpatterns = [
    path('', LeaveListCreateView.as_view(), name='leave-list'),
    path('<int:pk>/<str:action>/', LeaveReviewView.as_view(), name='leave-review'),
]
