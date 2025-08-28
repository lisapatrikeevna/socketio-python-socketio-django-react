from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from apps.users.serializers.login_serializer import LoginSerializer
import logging

logger = logging.getLogger(__name__)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info("Login attempt with data: %s", request.data)

        serializer = self.get_serializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            user = serializer.validated_data['user']
            logger.info(f"Authenticated user: {user.email}")

            access_token = str(AccessToken.for_user(user))
            refresh_token = str(RefreshToken.for_user(user))

            print('loginView(28),user------', user)
            response_data = {
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "is_staff": user.is_staff,
                    "is_admin": user.is_admin,
                    "is_superuser": user.is_superuser,
                    "id": user.id,
                },

            }

            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=True,
                samesite='None'
            )
            response.set_cookie(
                'refresh_token',
                refresh_token,
                httponly=True,
                secure=True,
                samesite='None'
            )

            print("Cookies set for access and refresh tokens.loginView(59)------")
            return response

        print("Login failed with errors: %s,loginView(62)------", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
