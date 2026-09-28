from django.db import models


class Lugar(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField()
    direccion = models.CharField(max_length=200)
    comuna = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100)
    imagen_url = models.URLField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre