from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.users.serializers.registration_serializer import RegisterSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken


class RegistrationView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny, )
    # print('-------------Registration-------------')
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # print('-------------Registration/create-------------')
        if serializer.is_valid():

            user = serializer.save()
            access_token = str(AccessToken.for_user(user))
            refresh_token = str(RefreshToken.for_user(user))

            response_data = {
                "user": {
                    "email": user.email,
                    "username": user.username,
                },

            }

            response = Response(response_data, status=status.HTTP_201_CREATED)

            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')


            response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='None')
            response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='None')

            return response

        # print('serializer', serializer)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


