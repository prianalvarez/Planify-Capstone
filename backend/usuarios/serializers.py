from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Perfil


class RegistroSerializer(serializers.Serializer):

    nombre = serializers.CharField(max_length=150)

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    tipo_usuario = serializers.ChoiceField(
        choices=Perfil.TIPO_USUARIO_CHOICES
    )

    rango_edad = serializers.ChoiceField(
        choices=Perfil.RANGO_EDAD_CHOICES,
        required=False,
        allow_blank=True
    )

    comuna = serializers.CharField(
        required=False,
        allow_blank=True
    )

    intereses = serializers.CharField(
        required=False,
        allow_blank=True
    )

    nombre_negocio = serializers.CharField(
        required=False,
        allow_blank=True
    )

    def validate_email(self, value):

        email = value.strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                'Ya existe una cuenta asociada a este correo.'
            )

        return email

    def validate(self, data):

        if (
            data['tipo_usuario'] == Perfil.NEGOCIO
            and not data.get('nombre_negocio')
        ):
            raise serializers.ValidationError({
                'nombre_negocio':
                'Debes indicar el nombre del negocio.'
            })

        return data

    def create(self, validated_data):

        email = validated_data['email']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=validated_data['nombre']
        )

        tipo_usuario = validated_data['tipo_usuario']

        estado_negocio = (
            'PENDIENTE'
            if tipo_usuario == Perfil.NEGOCIO
            else 'NO_APLICA'
        )

        Perfil.objects.create(
            usuario=user,
            tipo_usuario=tipo_usuario,
            rango_edad=validated_data.get(
                'rango_edad',
                ''
            ),
            comuna=validated_data.get(
                'comuna',
                ''
            ),
            intereses=validated_data.get(
                'intereses',
                ''
            ),
            nombre_negocio=validated_data.get(
                'nombre_negocio',
                ''
            ),
            estado_negocio=estado_negocio
        )

        return user