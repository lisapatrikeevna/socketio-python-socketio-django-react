from rest_framework import serializers
from apps.users.models import User


class SafeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ("password", "groups", "user_permissions")


class CreateUserSerializers(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if not data.get('username') and data.get('email'):
            data['username'] = data['email'].split('@')[0]

        if '@' in data['username']:
            raise serializers.ValidationError({
                'username': "Username cannot contain '@' symbol."
            })

        if not data.get('first_name') and data.get('email'):
            data['first_name'] = data['email'].split('@')[0]
        if not data.get('last_name'):
            data['last_name'] = "User"
        return data


    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


    def validate_username(self, value):
        if value and '@' in value:
            raise serializers.ValidationError(
                "Username cannot contain the '@' symbol. Use only letters, numbers, or underscores."
            )
        return value



class UserTeacherSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'