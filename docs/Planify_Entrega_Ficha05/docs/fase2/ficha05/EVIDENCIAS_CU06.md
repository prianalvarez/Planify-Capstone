# Evidencias del flujo CU06 - Registro de Usuario Persona

**Proyecto:** Planify  
**Versión probada:** v0.3  
**Fecha:** 25/10/2026  
**Caso de uso:** CU06 - Registrarse como Usuario Persona

## Objetivo
Comprobar un flujo de extremo a extremo desde el formulario Angular hasta la persistencia en PostgreSQL y la salida visible del usuario autenticado.

## Recorrido exitoso
1. El visitante selecciona **Crear cuenta**.
2. Angular muestra el formulario de registro.
3. Se ingresan nombre, correo, contraseña y tipo `PERSONA`; rango de edad, comuna e intereses son opcionales.
4. Angular valida campos obligatorios y coincidencia de contraseñas.
5. Angular ejecuta `POST /api/auth/register/`.
6. Django REST valida el correo y los datos.
7. Django crea `User` y `Perfil` con tipo `PERSONA`.
8. Los registros se guardan en PostgreSQL.
9. Django genera/retorna el token.
10. Angular guarda el token en `localStorage`.
11. Planify muestra **Mi Perfil** y adapta la navegación al usuario autenticado.

## Alternativa comprobada
Cuando se intenta registrar nuevamente un correo existente, el backend rechaza la operación y responde:

`Ya existe una cuenta asociada a este correo.`

La cuenta no se duplica y el usuario debe corregir el correo.

## Evidencias
- `evidencia_perfil_usuario_persona.png`: sesión Persona activa y vista Mi Perfil.
- `diagrama_actividades_CU06_registro_usuario_persona.png`: recorrido exitoso y alternativa de error.
- Código principal:
  - `frontend/src/app/app.ts`
  - `frontend/src/app/app.html`
  - `backend/usuarios/models.py`
  - `backend/usuarios/serializers.py`
  - `backend/usuarios/views.py`
  - `backend/usuarios/urls.py`
  - `backend/config/settings.py`

## Criterio de aceptación
El flujo se considera comprobado cuando:
- se crea una cuenta nueva sin errores;
- existen `User` y `Perfil PERSONA`;
- se recibe un token válido;
- al recargar la aplicación la sesión puede recuperarse;
- la interfaz muestra el nombre, correo y tipo de cuenta;
- un correo duplicado es rechazado sin crear una segunda cuenta.
