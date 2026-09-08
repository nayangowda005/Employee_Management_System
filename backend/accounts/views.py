from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .serializers import LoginSerializer, RegistrationSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({'message': 'Registration submitted for admin approval.', 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def pending_users(request):
    users = User.objects.filter(approval_status=User.ApprovalStatus.PENDING, role=User.Role.EMPLOYEE)
    return Response(UserSerializer(users, many=True).data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id, role=User.Role.EMPLOYEE)
    except User.DoesNotExist:
        return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    user.approval_status = User.ApprovalStatus.APPROVED
    user.is_active = True
    user.save(update_fields=['approval_status', 'is_active'])
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id, role=User.Role.EMPLOYEE)
    except User.DoesNotExist:
        return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    user.approval_status = User.ApprovalStatus.REJECTED
    user.is_active = False
    user.save(update_fields=['approval_status', 'is_active'])
    return Response(UserSerializer(user).data)
