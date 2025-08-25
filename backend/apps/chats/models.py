from django.db import models


class Chat(models.Model):
    room_name = models.CharField(max_length=120)

    def __str__(self):
        return self.room_name

    def get_messages(self):
        return self.messages.all()









