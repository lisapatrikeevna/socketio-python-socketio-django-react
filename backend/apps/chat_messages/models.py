from django.db import models

from apps.chats.models import Chat




class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    nick = models.CharField(max_length=120)
    text = models.TextField()

    def __str__(self):
        return f"{self.chat.room_name}- {self.nick}"







