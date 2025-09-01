from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.chats.models import Chat
from apps.users.models import User


@receiver(post_save, sender=User)
def create_chat_for_non_admin(sender, instance, created, **kwargs):
    if not created:
        return
    if getattr(instance, "is_admin", True):
        return
    if getattr(instance, 'is_admin', False) is False:
        Chat.objects.get_or_create(
            owner=instance,
            defaults={'room_name': f'chat_{instance.id}'},
        )