# Evidencia de Base de Datos - Planify

## Motor de base de datos
PostgreSQL.

## Base de datos
planify_db.

## Integración
Planify utiliza Django ORM y Django REST Framework para almacenar, validar y consultar la información persistida en PostgreSQL.

## Datos principales
Actualmente el sistema gestiona:

- Lugares.
- Eventos.
- Usuarios Django.
- Perfiles Planify.
- Tokens de autenticación.

## Evidencia técnica
La configuración, modelos y migraciones se encuentran principalmente en:

- backend/config/settings.py
- backend/lugares/models.py
- backend/lugares/migrations/
- backend/usuarios/models.py
- backend/usuarios/migrations/

## Persistencia
Los registros creados por la aplicación son almacenados en PostgreSQL y posteriormente recuperados mediante la API REST.

## Entornos
Durante el desarrollo se utiliza PostgreSQL local.

La versión desplegada utiliza PostgreSQL asociado al servicio de Planify en Render.
