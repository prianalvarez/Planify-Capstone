from django.db import models
from django.contrib.auth.models import User


class Perfil(models.Model):

    PERSONA = 'PERSONA'
    NEGOCIO = 'NEGOCIO'

    TIPO_USUARIO_CHOICES = [
        (PERSONA, 'Persona'),
        (NEGOCIO, 'Negocio'),
    ]

    ESTADO_NEGOCIO_CHOICES = [
        ('NO_APLICA', 'No aplica'),
        ('PENDIENTE', 'Pendiente'),
        ('VERIFICADO', 'Verificado'),
        ('RECHAZADO', 'Rechazado'),
        ('SUSPENDIDO', 'Suspendido'),
    ]

    RANGO_EDAD_CHOICES = [
        ('18-24', '18 a 24 años'),
        ('25-34', '25 a 34 años'),
        ('35-44', '35 a 44 años'),
        ('45-54', '45 a 54 años'),
        ('55+', '55 años o más'),
    ]

    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='perfil'
    )

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES
    )

    rango_edad = models.CharField(
        max_length=10,
        choices=RANGO_EDAD_CHOICES,
        blank=True
    )

    comuna = models.CharField(
        max_length=100,
        blank=True
    )

    intereses = models.TextField(
        blank=True
    )

    # Solo se utiliza cuando el usuario es NEGOCIO
    nombre_negocio = models.CharField(
        max_length=150,
        blank=True
    )

    estado_negocio = models.CharField(
        max_length=20,
        choices=ESTADO_NEGOCIO_CHOICES,
        default='NO_APLICA'
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f'{self.usuario.username} - {self.tipo_usuario}'