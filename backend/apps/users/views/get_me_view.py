from apps.users.models import User
from apps.users.serializers.logout_serializer import LogoutSerializer
from rest_framework import generics, permissions, status
from rest_framework.response import Response


class MeView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = self.request.user
        is_employee = any([user.is_admin, user.is_staff, user.is_superuser])
        if is_employee:
            print('------if any unknown_user(admin,staff,super)-----')
            response_data = User.objects.filter(pk=self.request.user.id).first()
            response = Response(
                {
                    'id': request.user.id,
                    'email': request.user.email,
                    "username": getattr(response_data, 'username', None),
                    'first_name': getattr(response_data, 'first_name', None),
                    'last_name': getattr(response_data, 'last_name', None),
                    "is_staff": getattr(response_data, 'is_staff', None),
                    "is_admin": getattr(response_data, 'is_admin', None),
                    "is_superuser": getattr(response_data, 'is_superuser', None)
                },
                status=status.HTTP_200_OK
            )
        else:
            response = Response(
                {'id': user.id, 'email': user.email, },
                status=status.HTTP_200_OK
            )

        return response
        #
        #         response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='None')
        #         response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='None')
        #
        #         return response
        #     else:
        #         return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
