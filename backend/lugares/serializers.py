from rest_framework import serializers
from .models import Lugar, Evento


class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = '__all__'


class EventoSerializer(serializers.ModelSerializer):
    lugar_nombre = serializers.CharField(
        source='lugar.nombre',
        read_only=True
    )

    class Meta:
        model = Evento
        fields = '__all__'