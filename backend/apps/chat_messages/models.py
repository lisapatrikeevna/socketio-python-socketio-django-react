from django.db import models
from django.contrib.auth import get_user_model

from apps.chats.models import Chat

from apps.users.models import User


class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.chat.room_name}- {self.user.username}"
