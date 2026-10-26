from django.contrib import admin

from .models import Perfil


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):

    list_display = (
        'usuario',
        'tipo_usuario',
        'nombre_negocio',
        'estado_negocio',
        'comuna',
        'fecha_creacion',
    )

    list_filter = (
        'tipo_usuario',
        'estado_negocio',
    )

    search_fields = (
        'usuario__username',
        'usuario__email',
        'nombre_negocio',
    )