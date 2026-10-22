import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';


interface Lugar {
  id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  comuna: string;
  categoria: string;
  imagen_url: string | null;
  activo: boolean;
  fecha_creacion: string;
}


interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: number;
  lugar_nombre: string;
  activo: boolean;
  fecha_creacion: string;
}


interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string;

  tipo_usuario:
    | 'PERSONA'
    | 'NEGOCIO'
    | 'ADMIN';

  estado_negocio: string | null;
  nombre_negocio: string | null;
}


interface AuthResponse {
  token: string;
  usuario: UsuarioSesion;
  mensaje?: string;
}


type Vista =
  | 'inicio'
  | 'eventos'
  | 'negocios'
  | 'admin'
  | 'login'
  | 'registro'
  | 'perfil';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private http = inject(HttpClient);


  // =====================================================
  // API
  // =====================================================

  // HOY usamos backend local.
  // Cuando terminemos y subamos a Render,
  // cambiaremos solamente esta línea.
  private readonly API_URL =
    'http://127.0.0.1:8000/api';


  // =====================================================
  // DATOS GENERALES
  // =====================================================

  lugares = signal<Lugar[]>([]);
  eventos = signal<Evento[]>([]);

  cargando = signal(true);
  error = signal('');

  lugarSeleccionado =
    signal<Lugar | null>(null);

  vista = signal<Vista>('inicio');

  mensajeNegocio = signal('');


  // =====================================================
  // AUTENTICACIÓN
  // =====================================================

  token = signal<string | null>(
    localStorage.getItem('planify_token')
  );

  usuarioActual =
    signal<UsuarioSesion | null>(null);

  cargandoAuth = signal(false);

  mensajeAuth = signal('');


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    this.obtenerLugares();

    this.obtenerEventos();

    if (this.token()) {
      this.recuperarSesion();
    }
  }


  // =====================================================
  // LUGARES
  // =====================================================

  obtenerLugares(): void {

    this.http
      .get<Lugar[]>(
        `${this.API_URL}/lugares/`
      )
      .subscribe({

        next: (datos) => {

          this.lugares.set(datos);

          this.cargando.set(false);
        },

        error: (err) => {

          console.error(
            'Error al obtener lugares:',
            err
          );

          this.error.set(
            'No se pudieron cargar los lugares.'
          );

          this.cargando.set(false);
        }

      });
  }


  // =====================================================
  // EVENTOS
  // =====================================================

  obtenerEventos(): void {

    this.http
      .get<Evento[]>(
        `${this.API_URL}/eventos/`
      )
      .subscribe({

        next: (datos) => {

          this.eventos.set(datos);
        },

        error: (err) => {

          console.error(
            'Error al obtener eventos:',
            err
          );
        }

      });
  }


  eventosDelLugar(
    lugarId: number
  ): Evento[] {

    return this.eventos().filter(

      evento =>
        evento.lugar === lugarId
        &&
        evento.activo

    );
  }


  // =====================================================
  // NAVEGACIÓN
  // =====================================================

  verLugar(
    lugar: Lugar
  ): void {

    this.lugarSeleccionado.set(lugar);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  volverInicio(): void {

    this.lugarSeleccionado.set(null);

    this.vista.set('inicio');

    this.mensajeAuth.set('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  mostrarEventos(): void {

    this.lugarSeleccionado.set(null);

    this.vista.set('eventos');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  mostrarLogin(): void {

    this.lugarSeleccionado.set(null);

    this.mensajeAuth.set('');

    this.vista.set('login');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  mostrarRegistro(): void {

    this.lugarSeleccionado.set(null);

    this.mensajeAuth.set('');

    this.vista.set('registro');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  mostrarPerfil(): void {

    if (!this.usuarioActual()) {

      this.mostrarLogin();

      return;
    }

    this.lugarSeleccionado.set(null);

    this.vista.set('perfil');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // =====================================================
  // ROLES
  // =====================================================

  esPersona(): boolean {

    return (
      this.usuarioActual()?.tipo_usuario
      === 'PERSONA'
    );
  }


  esNegocio(): boolean {

    return (
      this.usuarioActual()?.tipo_usuario
      === 'NEGOCIO'
    );
  }


  esAdmin(): boolean {

    return (
      this.usuarioActual()?.tipo_usuario
      === 'ADMIN'
    );
  }


  negocioPuedePublicar(): boolean {

    return (
      this.esNegocio()
      &&
      this.usuarioActual()
        ?.estado_negocio === 'VERIFICADO'
    );
  }


  estadoNegocioTexto(): string {

    const estado =
      this.usuarioActual()
        ?.estado_negocio;

    switch (estado) {

      case 'VERIFICADO':
        return 'Negocio verificado';

      case 'PENDIENTE':
        return 'Verificación pendiente';

      case 'RECHAZADO':
        return 'Solicitud rechazada';

      case 'SUSPENDIDO':
        return 'Negocio suspendido';

      default:
        return 'Sin estado';
    }
  }


  // =====================================================
  // TOKEN
  // =====================================================

  private headersAutenticados():
    HttpHeaders {

    const token = this.token();

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Token ${token}`
    });
  }


  private guardarSesion(
    respuesta: AuthResponse
  ): void {

    localStorage.setItem(
      'planify_token',
      respuesta.token
    );

    this.token.set(
      respuesta.token
    );

    this.usuarioActual.set(
      respuesta.usuario
    );
  }


  private limpiarSesion(): void {

    localStorage.removeItem(
      'planify_token'
    );

    this.token.set(null);

    this.usuarioActual.set(null);
  }


  // =====================================================
  // RECUPERAR SESIÓN
  // =====================================================

  recuperarSesion(): void {

    const token = this.token();

    if (!token) {
      return;
    }

    this.http
      .get<UsuarioSesion>(
        `${this.API_URL}/auth/me/`,
        {
          headers:
            this.headersAutenticados()
        }
      )
      .subscribe({

        next: (usuario) => {

          this.usuarioActual.set(
            usuario
          );
        },

        error: (err) => {

          console.error(
            'Sesión no válida:',
            err
          );

          this.limpiarSesion();
        }

      });
  }


  // =====================================================
  // LOGIN
  // =====================================================

  iniciarSesion(
    email: string,
    password: string
  ): void {

    email = email.trim();

    if (!email || !password) {

      this.mensajeAuth.set(
        'Completa correo y contraseña.'
      );

      return;
    }


    this.cargandoAuth.set(true);

    this.mensajeAuth.set('');


    this.http
      .post<AuthResponse>(
        `${this.API_URL}/auth/login/`,
        {
          email,
          password
        }
      )
      .subscribe({

        next: (respuesta) => {

          this.guardarSesion(
            respuesta
          );

          this.cargandoAuth.set(false);

          this.mensajeAuth.set('');


          if (
            respuesta.usuario
              .tipo_usuario === 'ADMIN'
          ) {

            this.vista.set('admin');

          } else if (
            respuesta.usuario
              .tipo_usuario === 'NEGOCIO'
          ) {

            this.vista.set(
              'negocios'
            );

          } else {

            this.vista.set(
              'inicio'
            );
          }

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        },


        error: (err) => {

          console.error(
            'Error al iniciar sesión:',
            err
          );

          this.cargandoAuth.set(false);

          this.mensajeAuth.set(
            err?.error?.error
            ||
            'No se pudo iniciar sesión.'
          );
        }

      });
  }


  // =====================================================
  // REGISTRO
  // =====================================================

  registrarUsuario(
    nombre: string,
    email: string,
    password: string,
    confirmarPassword: string,
    tipoUsuario: string,
    rangoEdad: string,
    comuna: string,
    intereses: string,
    nombreNegocio: string
  ): void {

    nombre = nombre.trim();

    email = email.trim();


    if (
      !nombre
      ||
      !email
      ||
      !password
      ||
      !tipoUsuario
    ) {

      this.mensajeAuth.set(
        'Completa los campos obligatorios.'
      );

      return;
    }


    if (
      password
      !== confirmarPassword
    ) {

      this.mensajeAuth.set(
        'Las contraseñas no coinciden.'
      );

      return;
    }


    if (
      tipoUsuario === 'NEGOCIO'
      &&
      !nombreNegocio.trim()
    ) {

      this.mensajeAuth.set(
        'Ingresa el nombre del negocio.'
      );

      return;
    }


    const datos = {

      nombre,

      email,

      password,

      tipo_usuario:
        tipoUsuario,

      rango_edad:
        rangoEdad,

      comuna,

      intereses,

      nombre_negocio:
        nombreNegocio.trim()
    };


    this.cargandoAuth.set(true);

    this.mensajeAuth.set('');


    this.http
      .post<AuthResponse>(
        `${this.API_URL}/auth/register/`,
        datos
      )
      .subscribe({

        next: (respuesta) => {

          this.guardarSesion(
            respuesta
          );

          this.cargandoAuth.set(false);


          if (
            respuesta.usuario
              .tipo_usuario
            === 'NEGOCIO'
          ) {

            this.mensajeNegocio.set(
              'Tu negocio fue registrado. '
              +
              'La verificación está pendiente.'
            );

            this.vista.set(
              'negocios'
            );

          } else {

            this.vista.set(
              'perfil'
            );
          }


          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        },


        error: (err) => {

          console.error(
            'Error al registrar:',
            err
          );

          this.cargandoAuth.set(false);


          if (
            err?.error?.email
          ) {

            this.mensajeAuth.set(
              err.error.email[0]
            );

          } else if (
            err?.error
              ?.nombre_negocio
          ) {

            this.mensajeAuth.set(
              err.error
                .nombre_negocio[0]
            );

          } else {

            this.mensajeAuth.set(
              'No se pudo crear la cuenta.'
            );
          }
        }

      });
  }


  // =====================================================
  // LOGOUT
  // =====================================================

  cerrarSesion(): void {

    if (!this.token()) {

      this.limpiarSesion();

      this.volverInicio();

      return;
    }


    this.http
      .post(
        `${this.API_URL}/auth/logout/`,
        {},
        {
          headers:
            this.headersAutenticados()
        }
      )
      .subscribe({

        next: () => {

          this.limpiarSesion();

          this.volverInicio();
        },

        error: () => {

          // Aunque falle el servidor,
          // cerramos la sesión local.
          this.limpiarSesion();

          this.volverInicio();
        }

      });
  }


  // =====================================================
  // NEGOCIOS
  // =====================================================

  mostrarNegocios(): void {

    if (!this.esNegocio()) {

      this.mensajeAuth.set(
        'Debes iniciar sesión '
        +
        'con una cuenta de negocio.'
      );

      this.mostrarLogin();

      return;
    }


    this.lugarSeleccionado.set(null);

    this.vista.set('negocios');

    this.mensajeNegocio.set('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  crearEvento(
    titulo: string,
    descripcion: string,
    fecha: string,
    hora: string,
    lugar: string
  ): void {

    if (!this.esNegocio()) {

      this.mensajeNegocio.set(
        'Debes iniciar sesión '
        +
        'como negocio.'
      );

      return;
    }


    if (!this.negocioPuedePublicar()) {

      this.mensajeNegocio.set(
        'Tu negocio todavía '
        +
        'no está verificado.'
      );

      return;
    }


    if (
      !titulo
      ||
      !descripcion
      ||
      !fecha
      ||
      !hora
      ||
      !lugar
    ) {

      this.mensajeNegocio.set(
        'Completa todos los campos '
        +
        'antes de publicar.'
      );

      return;
    }


    const nuevoEvento = {

      titulo,

      descripcion,

      fecha,

      hora,

      lugar:
        Number(lugar),

      activo: true
    };


    this.http
      .post<Evento>(
        `${this.API_URL}/eventos/`,
        nuevoEvento,
        {
          headers:
            this.headersAutenticados()
        }
      )
      .subscribe({

        next: () => {

          this.mensajeNegocio.set(
            '✅ Evento publicado correctamente.'
          );

          this.obtenerEventos();
        },

        error: (err) => {

          console.error(
            'Error al crear evento:',
            err
          );

          this.mensajeNegocio.set(
            '❌ No se pudo publicar el evento.'
          );
        }

      });
  }


  // =====================================================
  // ADMIN
  // =====================================================

  mostrarAdmin(): void {

    if (!this.esAdmin()) {

      this.mensajeAuth.set(
        'Esta sección requiere '
        +
        'una cuenta de administrador.'
      );

      this.mostrarLogin();

      return;
    }


    this.lugarSeleccionado.set(null);

    this.vista.set('admin');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}