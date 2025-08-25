from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
# from apps.users.serializers.logout_serializer import LogoutSerializer
from apps.users.serializers.refresh_serializer import RefreshSerializer
# from apps.users.views.logout_view import LogoutView


class RefreshTokenView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RefreshSerializer

    def post(self, request, *args, **kwargs):
        print("class RefreshTokenView/Received cookies(19):", request.COOKIES)
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"detail": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            refresh_token = str(token)

            return Response({
                # "access_token": access_token,
                # "refresh_token": refresh_token,
            }, status=status.HTTP_200_OK)

        except TokenError:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
