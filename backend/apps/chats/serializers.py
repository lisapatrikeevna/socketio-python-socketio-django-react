from rest_framework import serializers

from apps.chats.models import Chat
from apps.users.models import User


class ChatSerializer(serializers.ModelSerializer):
    owner_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    owner_email = serializers.SerializerMethodField()
    owner_username = serializers.SerializerMethodField()

    def get_owner_username(self, obj):
        return obj.owner.username if obj.owner else None

    def get_owner_email(self, obj):
        return obj.owner.email if obj.owner else None

    class Meta:
        model = Chat
        fields = '__all__'