from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)

from rest_framework.authtoken.models import Token

from .serializers import RegistroSerializer


def datos_usuario(user):

    if user.is_superuser or user.is_staff:

        return {
            'id': user.id,
            'nombre': user.first_name,
            'email': user.email,
            'tipo_usuario': 'ADMIN',
            'estado_negocio': None,
            'nombre_negocio': None,
        }

    perfil = getattr(user, 'perfil', None)

    return {
        'id': user.id,
        'nombre': user.first_name,
        'email': user.email,

        'tipo_usuario':
            perfil.tipo_usuario
            if perfil else 'PERSONA',

        'estado_negocio':
            perfil.estado_negocio
            if perfil else None,

        'nombre_negocio':
            perfil.nombre_negocio
            if perfil else None,
    }


class RegistroView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegistroSerializer(
            data=request.data
        )

        if serializer.is_valid():

            user = serializer.save()

            token, _ = Token.objects.get_or_create(
                user=user
            )

            return Response(
                {
                    'mensaje':
                        'Usuario registrado correctamente.',

                    'token':
                        token.key,

                    'usuario':
                        datos_usuario(user)
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = (
            request.data.get('email', '')
            .strip()
            .lower()
        )

        password = request.data.get(
            'password',
            ''
        )

        user = authenticate(
            username=email,
            password=password
        )

        if not user:

            return Response(
                {
                    'error':
                        'Correo o contraseña incorrectos.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(
            user=user
        )

        return Response({
            'token': token.key,
            'usuario': datos_usuario(user)
        })


class UsuarioActualView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            datos_usuario(request.user)
        )


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.auth:
            request.auth.delete()

        return Response({
            'mensaje':
                'Sesión cerrada correctamente.'
        })