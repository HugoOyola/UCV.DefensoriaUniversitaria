import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { GestionModalesComponent } from '@app/page/main/components/gestion/modales/gestion-modales.component';
import { SkeletonComponent } from '@shared/components/skeleon/skeleton.component';
import { MainService } from '../../services/main.service';
import {
  Denuncia,
  EstadoDenuncia,
  PrioridadDenuncia,
  TipoUsuarioDenuncia,
} from '../../interface/denuncias.interface';

type TipoUsuarioUi = {
  icon: string;
  wrapperClass: string;
  iconClass: string;
};

type EstadoUi = {
  icon: string;
  badgeClass: string;
  iconClass?: string;
};

type PrioridadUi = {
  badgeClass: string;
  dotClass: string;
};

@Component({
  selector: 'app-gestion',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TooltipModule,
    SkeletonComponent,
    GestionModalesComponent,
  ],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MainService],
})
export class GestionComponent {
  private readonly mainService = inject(MainService);

  public complaintSeleccionado = signal<Denuncia | null>(null);
  public mostrarModalDetalle = signal(false);
  public mostrarModalResponder = signal(false);
  public mostrarModalDerivar = signal(false);
  public mostrarModalHistorial = signal(false);

  public searchTerm = signal('');
  public selectedStatus = signal<EstadoDenuncia | null>(null);
  public selectedPriority = signal<PrioridadDenuncia | null>(null);
  public cargando = signal(true);
  public errorCarga = signal<string | null>(null);

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

  public complaints = signal<Denuncia[]>([]);

  private readonly tipoUsuarioUi: Record<TipoUsuarioDenuncia, TipoUsuarioUi> = {
    '13': {
      icon: 'pi-user',
      wrapperClass: 'flex h-8 w-8 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600',
      iconClass: 'text-sm text-blue-600',
    },
    '12': {
      icon: 'pi-book',
      wrapperClass: 'flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600',
      iconClass: 'text-sm text-emerald-600',
    },
    '21': {
      icon: 'pi-briefcase',
      wrapperClass: 'flex h-8 w-8 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600',
      iconClass: 'text-sm text-orange-600',
    },
    '14': {
      icon: 'pi-user-edit',
      wrapperClass: 'flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600',
      iconClass: 'text-sm text-rose-600',
    },
    '72': {
      icon: 'pi-graduation-cap',
      wrapperClass: 'flex h-8 w-8 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600',
      iconClass: 'text-sm text-violet-600',
    },
  };

  private readonly estadoUi: Record<EstadoDenuncia, EstadoUi> = {
    Pendiente: {
      icon: 'pi-clock',
      badgeClass:
        'inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700 estado-pendiente-anim',
    },
    'En Proceso': {
      icon: 'pi-spinner pi-spin',
      badgeClass:
        'inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800',
    },
    Resuelto: {
      icon: 'pi-check-circle',
      badgeClass:
        'inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm estado-resuelto-anim',
    },
  };

  private readonly prioridadUi: Record<PrioridadDenuncia, PrioridadUi> = {
    Alta: {
      badgeClass:
        'inline-flex items-center gap-2 rounded-full bg-red-50 px-2.5 py-1 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200',
      dotClass: 'h-2.5 w-2.5 rounded-full bg-red-500 prioridad-alta-dot-anim',
    },
    Media: {
      badgeClass:
        'inline-flex items-center gap-2 rounded-full bg-orange-50 px-2.5 py-1 text-sm font-semibold text-orange-700 ring-1 ring-inset ring-orange-200',
      dotClass: 'h-2.5 w-2.5 rounded-full bg-orange-500 prioridad-media-dot-anim',
    },
    Baja: {
      badgeClass:
        'inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200',
      dotClass: 'h-2.5 w-2.5 rounded-full bg-amber-400',
    },
  };

  constructor() {
    this.cargarDenuncias();
  }

  private cargarDenuncias(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);

    this.mainService.post_Main_ObtenerDenuncias().subscribe({
      next: (response) => {
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
      },
    });
  }

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

      return (!status || c.estado === status) && (!priority || c.prioridad === priority) && matchesTerm;
    });
  });

  getTipoUsuarioUi(tipo: TipoUsuarioDenuncia): TipoUsuarioUi {
    return this.tipoUsuarioUi[tipo] ?? this.tipoUsuarioUi['13'];
  }

  getEstadoUi(estado: EstadoDenuncia): EstadoUi {
    return this.estadoUi[estado] ?? this.estadoUi['Pendiente'];
  }

  getPrioridadUi(prioridad: PrioridadDenuncia): PrioridadUi {
    return this.prioridadUi[prioridad] ?? this.prioridadUi.Baja;
  }

  getTipoUsuarioLabel(tipo: TipoUsuarioDenuncia): string {
    const map: Record<TipoUsuarioDenuncia, string> = {
      '13': 'Estudiante',
      '12': 'Docente',
      '21': 'Administrativo',
      '14': 'Egresado',
      '72': 'Graduado',
    };

    return map[tipo] ?? tipo;
  }

  viewComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalDetalle.set(true);
  }

  onDetalleVisibleChange(value: boolean): void {
    this.mostrarModalDetalle.set(value);
    if (!value) {
      this.complaintSeleccionado.set(null);
    }
  }

  onGuardarCambios(updatedComplaint: Denuncia): void {
    this.complaints.update((lista) =>
      lista.map((item) =>
        item.expediente === updatedComplaint.expediente ? { ...updatedComplaint } : item
      )
    );

    this.complaintSeleccionado.set(updatedComplaint);
    this.mostrarModalDetalle.set(false);
  }

  responderComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalResponder.set(true);
  }

  onResponderVisibleChange(value: boolean): void {
    this.mostrarModalResponder.set(value);

    if (!value && !this.mostrarModalDetalle()) {
      this.complaintSeleccionado.set(null);
    }
  }

  manejarEnvioRespuesta(updatedComplaint: Denuncia): void {
    const complaint = this.complaintSeleccionado();
    if (!complaint) {
      return;
    }

    this.complaints.update((lista) =>
      lista.map((item) =>
        item.expediente === complaint.expediente
          ? { ...updatedComplaint }
          : item
      )
    );

    this.complaintSeleccionado.set(updatedComplaint);
    this.mostrarModalResponder.set(false);
  }

  derivarComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalDerivar.set(true);
  }

  cerrarModalDerivar(): void {
    this.mostrarModalDerivar.set(false);
  }

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