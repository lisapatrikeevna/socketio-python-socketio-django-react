from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

class RefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate_refresh_token(self, value):
        try:
            RefreshToken(value)
        except TokenError as e:
            raise serializers.ValidationError(f"Invalid refresh token: {str(e)}")
        return value

    def create(self, validated_data):
        refresh_token = validated_data['refresh_token']
        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)
            return {
                'access_token': new_access_token,
            }
        except TokenError as e:
            raise serializers.ValidationError(f"Failed to refresh token: {str(e)}")
