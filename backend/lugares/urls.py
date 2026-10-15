from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LugarViewSet, EventoViewSet


router = DefaultRouter()

router.register(
    r'lugares',
    LugarViewSet,
    basename='lugar'
)

router.register(
    r'eventos',
    EventoViewSet,
    basename='evento'
)


urlpatterns = [
    path('', include(router.urls)),
]