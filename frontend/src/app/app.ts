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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private http = inject(HttpClient);

  lugares = signal<Lugar[]>([]);
  cargando = signal(true);
  error = signal('');

  lugarSeleccionado = signal<Lugar | null>(null);

  ngOnInit(): void {
    this.obtenerLugares();
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

  verLugar(lugar: Lugar): void {
    this.lugarSeleccionado.set(lugar);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volverInicio(): void {
    this.lugarSeleccionado.set(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}