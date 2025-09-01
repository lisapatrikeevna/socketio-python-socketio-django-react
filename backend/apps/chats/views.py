from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.chats.serializers import ChatSerializer
from apps.chats.models import Chat


class ChatView(generics.GenericAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = self.request.user
        is_admin = any([user.is_admin, user.is_superuser])  #user.is_staff ?
        if is_admin:
            chats = Chat.objects.all()
        else:
            chats = Chat.objects.filter(owner=user)

        serializer = ChatSerializer(chats, many=True)
        response = Response(serializer.data,
            status=status.HTTP_200_OK
        )

        return response