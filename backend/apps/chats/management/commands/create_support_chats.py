from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.chats.models import Chat

User = get_user_model()

class Command(BaseCommand):
    help = "Создать комнаты для всех не-админов, у кого их ещё нет"

    def handle(self, *args, **options):
        users = User.objects.filter(is_admin=False)
        created = 0
        for u in users:
            chat, was_created = Chat.objects.get_or_create(
                owner=u,
                defaults={'room_name': f"chat_{u.id}"},
            )
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Создано новых комнат: {created}"))