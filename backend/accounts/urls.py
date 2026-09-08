from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, approve_user, me, pending_users, register, reject_user

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/', me, name='me'),
    path('pending/', pending_users, name='pending-users'),
    path('<int:user_id>/approve/', approve_user, name='approve-user'),
    path('<int:user_id>/reject/', reject_user, name='reject-user'),
]
