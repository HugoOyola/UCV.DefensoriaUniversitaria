import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MainService } from '../../services/main.service';
import {
  Denuncia,
  EstadoDenuncia,
  PrioridadDenuncia,
  TipoUsuarioDenuncia,
  TipoUsuarioStyle,
  EstadoStyle,
  PrioridadStyle
} from '../../interface/denuncias.interface';
@Component({
  selector: "app-gestion",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: "./gestion.component.html",
  styleUrl: "./gestion.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MainService]
})
export class GestionComponent {
  // Servicio inyectado. Aqui hoy usamos mock y luego podra apuntar al endpoint real.
  private readonly mainService = inject(MainService);

  // Signals para controlar la apertura de modales y el item seleccionado.
  public complaintSeleccionado = signal<Denuncia | null>(null);
  public mostrarModalDetalle = signal(false);
  public mostrarModalResponder = signal(false);
  public mostrarModalDerivar = signal(false);
  public mostrarModalHistorial = signal(false);

  // Signals de filtros y estado de carga de la vista.
  public searchTerm = signal('');
  public selectedStatus = signal<EstadoDenuncia | null>(null);
  public selectedPriority = signal<PrioridadDenuncia | null>(null);
  public cargando = signal(true);
  public errorCarga = signal<string | null>(null);

  // ─── Opciones de selectores ──────────────────────────────────────────────────
  public statusOptions = [
    { label: 'Pendiente', value: 'Pendiente' as EstadoDenuncia },
    { label: 'En Proceso', value: 'En Proceso' as EstadoDenuncia },
    { label: 'Resuelto', value: 'Resuelto' as EstadoDenuncia },
  ];

  public priorityOptions = [
    { label: 'Alta', value: 'Alta' as PrioridadDenuncia },
    { label: 'Media', value: 'Media' as PrioridadDenuncia },
    { label: 'Baja', value: 'Baja' as PrioridadDenuncia },
  ];

  // Lista base que alimenta la tabla.
  public complaints = signal<Denuncia[]>([]);

  constructor() {
    this.cargarDenuncias();
  }

  /**
   * Carga las denuncias desde el servicio.
   * Como es una llamada HTTP simple, la suscripcion se completa sola.
   * Cuando exista el endpoint real, el cambio quedara encapsulado en el servicio.
   */
  private cargarDenuncias(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);

    this.mainService.post_Main_ObtenerDenuncias()
      .subscribe({
        next: (response) => {
          // Tomamos la lista desde la misma estructura que luego devolvera la API.
          this.complaints.set(response.body?.lstItem ?? []);
        },
        error: (error) => {
          console.error('Error al cargar las denuncias:', error);
          this.complaints.set([]);
          this.errorCarga.set('No se pudo cargar el listado de denuncias.');
          this.cargando.set(false);
        },
        complete: () => {
          this.cargando.set(false);
        }
      });
  }

  // Mapas visuales para no repetir colores o iconos dentro del HTML.
  private readonly TIPO_USUARIO_STYLES: Record<TipoUsuarioDenuncia, TipoUsuarioStyle> = {
    '13': { iconBg: '#dbeafe', iconColor: '#2563eb', icon: 'pi-user' },
    '12': { iconBg: '#dcfce7', iconColor: '#16a34a', icon: 'pi-book' },
    '21': { iconBg: '#ffedd5', iconColor: '#ea580c', icon: 'pi-briefcase' },
    '14': { iconBg: '#fee2e2', iconColor: '#dc2626', icon: 'pi-user-edit' },
    '72': { iconBg: '#f3e8ff', iconColor: '#9333ea', icon: 'pi-graduation-cap' }
  };

  private readonly ESTADO_STYLES: Record<EstadoDenuncia, EstadoStyle> = {
    'Pendiente': { bg: '#e7e5e4', text: '#44403c', border: '#d6d3d1', icon: 'pi-clock', animation: 'animate-pulse' },
    'En Proceso': { bg: '#dbeafe', text: '#1e3a8a', border: '#93c5fd', icon: 'pi-spin pi-spinner', animation: '' },
    'Resuelto': { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', icon: 'pi-check-circle', animation: 'animate-bounce-soft' },
  };

  private readonly PRIORIDAD_STYLES: Record<PrioridadDenuncia, PrioridadStyle> = {
    Alta: { bg: '#fee2e2', text: '#991b1b', dotBg: '#dc2626', animation: 'animate-ping-dot' },
    Media: { bg: '#ffedd5', text: '#9a3412', dotBg: '#ea580c', animation: 'animate-pulse-slow' },
    Baja: { bg: '#fef9c3', text: '#854d0e', dotBg: '#eab308', animation: '' },
  };

  // Computed que recalcula la tabla cada vez que cambian datos o filtros.
  public filteredComplaints = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const priority = this.selectedPriority();

    return this.complaints().filter((c) => {
      const nombreCompleto = `${c.nombre} ${c.apellidos}`.toLowerCase();
      const tipoUsuarioLabel = this.getTipoUsuarioLabel(c.tipoUsuario).toLowerCase();

      const matchesTerm =
        !term ||
        c.expediente.toLowerCase().includes(term) ||
        nombreCompleto.includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.documento.toLowerCase().includes(term) ||
        tipoUsuarioLabel.includes(term);

      return (
        (!status || c.estado === status) &&
        (!priority || c.prioridad === priority) &&
        matchesTerm
      );
    });
  });

  // Helpers usados por la plantilla para mostrar etiquetas y estilos.
  getTipoUsuarioStyle(tipo: TipoUsuarioDenuncia): TipoUsuarioStyle {
    return this.TIPO_USUARIO_STYLES[tipo] || this.TIPO_USUARIO_STYLES['13'];
  }
  getEstadoStyle(estado: EstadoDenuncia): EstadoStyle { return this.ESTADO_STYLES[estado] || this.ESTADO_STYLES['Pendiente']; }
  getPrioridadStyle(prioridad: PrioridadDenuncia): PrioridadStyle { return this.PRIORIDAD_STYLES[prioridad] || this.PRIORIDAD_STYLES['Baja']; }
  getTipoUsuarioLabel(tipo: TipoUsuarioDenuncia): string {
    const map: Record<TipoUsuarioDenuncia, string> = {
      '13': 'Estudiante',
      '12': 'Docente',
      '21': 'Administrativo',
      '14': 'Egresado',
      '72': 'Graduado'
    };

    return map[tipo] || tipo;
  }

  // Acciones de UI.
  viewComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalDetalle.set(true);
  }

  cerrarModal(): void {
    this.mostrarModalDetalle.set(false);
  }

  // ─── Acciones: modal Responder ───────────────────────────────────────────────
  responderComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalResponder.set(true);
  }

  cerrarModalResponder(): void {
    this.mostrarModalResponder.set(false);
  }

  manejarEnvioRespuesta(): void {
    const complaint = this.complaintSeleccionado();
    if (!complaint) return;

    // Actualizamos el estado local para reflejar el cambio en pantalla.
    this.complaints.update((lista) =>
      lista.map((item) =>
        item.expediente === complaint.expediente
          ? { ...item, estado: 'En Proceso' }
          : item
      )
    );

    this.cerrarModalResponder();
  }

  // ─── Acciones: modal Derivar ─────────────────────────────────────────────────
  derivarComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalDerivar.set(true);
  }

  cerrarModalDerivar(): void {
    this.mostrarModalDerivar.set(false);
  }

  // ─── Acciones: modal Historial ───────────────────────────────────────────────
  verHistorialComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalHistorial.set(true);
  }

  cerrarModalHistorial(): void {
    this.mostrarModalHistorial.set(false);
  }

  exportData(): void {
    console.log('Exportando:', this.filteredComplaints());
  }
}