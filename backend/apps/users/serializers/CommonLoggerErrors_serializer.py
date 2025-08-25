from rest_framework import serializers

from apps.users.models import CommonLoggerErrors


class CommonLoggerErrorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonLoggerErrors
        fields = '__all__'
