from rest_framework import viewsets
from .models import Lugar, Evento
from .serializers import LugarSerializer, EventoSerializer
from rest_framework.authtoken.models import Token


class LugarViewSet(viewsets.ModelViewSet):
    queryset = Lugar.objects.all()
    serializer_class = LugarSerializer


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('fecha', 'hora')
    serializer_class = EventoSerializer