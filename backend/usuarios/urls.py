from django.urls import path

from .views import (
    RegistroView,
    LoginView,
    LogoutView,
    UsuarioActualView
)


urlpatterns = [

    path(
        'register/',
        RegistroView.as_view(),
        name='register'
    ),

    path(
        'login/',
        LoginView.as_view(),
        name='login'
    ),

    path(
        'me/',
        UsuarioActualView.as_view(),
        name='me'
    ),

    path(
        'logout/',
        LogoutView.as_view(),
        name='logout'
    ),
]