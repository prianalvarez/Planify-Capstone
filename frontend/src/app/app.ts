import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private http = inject(HttpClient);

  lugares = signal<Lugar[]>([]);
  eventos = signal<Evento[]>([]);

  cargando = signal(true);
  error = signal('');

  lugarSeleccionado = signal<Lugar | null>(null);

  vista = signal<'inicio' | 'eventos' | 'negocios' | 'admin'>('inicio');

  mensajeNegocio = signal('');

  ngOnInit(): void {
    this.obtenerLugares();
    this.obtenerEventos();
  }

  obtenerLugares(): void {
    this.http
      .get<Lugar[]>('http://127.0.0.1:8000/api/lugares/')
      .subscribe({
        next: (datos) => {
          this.lugares.set(datos);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al obtener lugares:', err);
          this.error.set('No se pudieron cargar los lugares.');
          this.cargando.set(false);
        }
      });
  }

  obtenerEventos(): void {
    this.http
      .get<Evento[]>('http://127.0.0.1:8000/api/eventos/')
      .subscribe({
        next: (datos) => {
          this.eventos.set(datos);
        },
        error: (err) => {
          console.error('Error al obtener eventos:', err);
        }
      });
  }

  verLugar(lugar: Lugar): void {
    this.lugarSeleccionado.set(lugar);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volverInicio(): void {
    this.lugarSeleccionado.set(null);
    this.vista.set('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  mostrarEventos(): void {
    this.lugarSeleccionado.set(null);
    this.vista.set('eventos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eventosDelLugar(lugarId: number): Evento[] {
    return this.eventos().filter(
      evento => evento.lugar === lugarId && evento.activo
    );
  }
  mostrarNegocios(): void {
  this.lugarSeleccionado.set(null);
  this.vista.set('negocios');
  this.mensajeNegocio.set('');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

crearEvento(
  titulo: string,
  descripcion: string,
  fecha: string,
  hora: string,
  lugar: string
): void {

  if (!titulo || !descripcion || !fecha || !hora || !lugar) {
    this.mensajeNegocio.set('Completa todos los campos antes de publicar.');
    return;
  }

  const nuevoEvento = {
    titulo: titulo,
    descripcion: descripcion,
    fecha: fecha,
    hora: hora,
    lugar: Number(lugar),
    activo: true
  };

  this.http
    .post<Evento>(
      'http://127.0.0.1:8000/api/eventos/',
      nuevoEvento
    )
    .subscribe({
      next: () => {
        this.mensajeNegocio.set('✅ Evento publicado correctamente.');
        this.obtenerEventos();
      },
      error: (err) => {
        console.error('Error al crear evento:', err);
        this.mensajeNegocio.set('❌ No se pudo publicar el evento.');
      }
    });
}
mostrarAdmin(): void {
  this.lugarSeleccionado.set(null);
  this.vista.set('admin');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
