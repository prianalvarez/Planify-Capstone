# Evidencia de Base de Datos - Planify

## Motor
PostgreSQL

## Base de datos
planify_db

## Integración
La aplicación utiliza Django ORM y Django REST Framework para almacenar y consultar información.

## Datos principales
Actualmente el sistema maneja, entre otros:

- Lugares
- Eventos
- Usuarios Django
- Perfiles Planify
- Tokens de autenticación

## Evidencia técnica
La configuración y modelos se encuentran principalmente en:

- backend/config/settings.py
- backend/lugares/models.py
- backend/usuarios/models.py
- backend/lugares/migrations/
- backend/usuarios/migrations/

## Persistencia
Los registros creados desde Planify son persistidos en PostgreSQL y recuperados mediante la API REST.

## Despliegue
La versión publicada utiliza PostgreSQL en Render, mientras que el entorno de desarrollo utiliza PostgreSQL local.
