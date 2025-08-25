from rest_framework import serializers
from apps.users.models import User



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password','username']

    def validate(self, attrs):
        email = attrs.get('email')
        if not email:
            raise serializers.ValidationError({'email': 'Email is required.'})

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'User with this email already exists.'})

        return attrs

    def create(self, validated_data):
        # print('------------validated_data--------------', validated_data)
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


