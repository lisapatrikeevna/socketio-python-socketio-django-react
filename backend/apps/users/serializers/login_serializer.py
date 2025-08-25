from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.users.models import User
from django.contrib.auth.hashers import check_password


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        try:
            user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                raise serializers.ValidationError("User with provided email/username does not exist.")

        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid username/email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")

        attrs['user'] = user
        return attrs
