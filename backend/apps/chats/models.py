from django.db import models

from apps.users.models import User


class Chat(models.Model):
    room_name = models.CharField(max_length=120)
    owner = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='chat', null=True, blank=True
    )
    def __str__(self):
        return self.room_name

    def get_messages(self):
        return self.messages.all()









