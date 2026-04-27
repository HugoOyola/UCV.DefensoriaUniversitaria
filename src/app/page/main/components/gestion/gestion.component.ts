import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { GestionarModalComponent } from '@app/page/main/components/gestion/modales/gestionar/gestionar-modal.component';
import { ResponderModalComponent } from '@app/page/main/components/gestion/modales/responder/responder-modal.component';
import { DerivarModalComponent } from '@app/page/main/components/gestion/modales/derivar/derivar-modal.component';
import { DenunciasService } from '../../services/denuncias.service';
import {
  Denuncia,
  DerivacionDenuncia,
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
    DatePickerModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TooltipModule,
    GestionarModalComponent,
    ResponderModalComponent,
    DerivarModalComponent,
  ],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionComponent {
  private readonly denunciasService = inject(DenunciasService);

  public readonly datePickerLocale = {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    monthNamesShort: [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ],
    today: 'Hoy',
    clear: 'Limpiar',
    weekHeader: 'Sem',
  };

  public complaintSeleccionado = signal<Denuncia | null>(null);
  public mostrarModalDetalle = signal(false);
  public mostrarModalResponder = signal(false);
  public mostrarModalDerivar = signal(false);
  public mostrarModalHistorial = signal(false);

  // Estado de busqueda/filtros en UI.
  public searchInputTerm = signal('');
  public searchTerm = signal('');
  public searchMode = signal<'none' | 'date' | 'text'>('none');
  public hasExecutedSearch = signal(false);
  public selectedTipoUsuario = signal<TipoUsuarioDenuncia | null>(null);
  public selectedStatus = signal<EstadoDenuncia | null>(null);
  public selectedPriority = signal<PrioridadDenuncia | null>(null);
  public selectedDateRange = signal<Date[] | null>(null);
  public cargando = signal(true);
  public errorCarga = signal<string | null>(null);

  public tipoOptions = [
    { label: 'Estudiante', value: '13' as TipoUsuarioDenuncia },
    { label: 'Docente', value: '12' as TipoUsuarioDenuncia },
    { label: 'Administrativo', value: '21' as TipoUsuarioDenuncia },
    { label: 'Egresado', value: '14' as TipoUsuarioDenuncia },
    { label: 'Graduado', value: '72' as TipoUsuarioDenuncia },
  ];

  public statusOptions = [
    { label: 'Sin Atender', value: 'Sin Atender' as EstadoDenuncia },
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
    'Sin Atender': {
      icon: 'pi-minus-circle',
      badgeClass:
        'inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500',
    },
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
    // Carga inicial: requiere rango de fechas valido para consultar.
    this.cargarDenuncias();
  }

  private cargarDenuncias(dateRange: Date[] | null = null): void {
    const [startDate, endDate] = dateRange ?? [];
    const hasCompleteRange =
      !!startDate &&
      !!endDate &&
      !Number.isNaN(startDate.getTime()) &&
      !Number.isNaN(endDate.getTime());

    if (!hasCompleteRange) {
      // Sin rango completo no se consulta al backend.
      return;
    }

    this.errorCarga.set(null);

    const fechaInicio = hasCompleteRange ? startDate : null;
    const fechaFin = hasCompleteRange ? endDate : null;

    this.denunciasService
      .listarDenuncias({
        idPerfil: 12,
        estadoExp: 0,
        prioridades: 0,
        fechaInicio,
        fechaFin,
      })
      .subscribe({
        next: (denuncias) => {
          // Lista base que alimenta tabla y calculos/filtros locales.
          this.complaints.set(denuncias);
        },
        error: (error) => {
          console.error('Error al cargar las denuncias:', error);
          this.complaints.set([]);
          this.errorCarga.set('No se pudo cargar el listado de denuncias.');
        },
      });
  }

  onDateRangeChange(value: Date[] | null): void {
    this.selectedDateRange.set(value);

    if (this.hasSelectedDateRange()) {
      // Filtro por fecha: consulta backend con el rango elegido.
      this.cargarDenuncias(value);
      this.searchMode.set('date');
      this.hasExecutedSearch.set(true);
      return;
    }

    if (this.searchMode() === 'date') {
      this.searchMode.set('none');
      this.hasExecutedSearch.set(false);
    }
  }

  onBuscar(): void {
    const term = this.searchInputTerm().trim();

    this.searchTerm.set(term);
    if (!term) {
      if (this.searchMode() === 'text') {
        this.searchMode.set('none');
        this.hasExecutedSearch.set(false);
      }
      return;
    }

    this.searchMode.set('text');
    this.hasExecutedSearch.set(true);
  }

  nuevaBusqueda(): void {
    // Reinicia filtros visuales; no dispara consulta hasta seleccionar fecha o buscar.
    this.selectedDateRange.set(null);
    this.searchInputTerm.set('');
    this.searchTerm.set('');
    this.searchMode.set('none');
    this.hasExecutedSearch.set(false);
    this.selectedTipoUsuario.set(null);
    this.selectedStatus.set(null);
    this.selectedPriority.set(null);
  }

  public filteredComplaints = computed(() => {
    // Filtro final combinado: modo de busqueda + filtros por columnas.
    const mode = this.searchMode();
    const term = this.searchTerm().trim().toLowerCase();
    const tipoUsuario = this.selectedTipoUsuario();
    const status = this.selectedStatus();
    const priority = this.selectedPriority();
    const dateRange = this.selectedDateRange();

    const [startDate, endDate] = dateRange ?? [];

    const normalizedStart = startDate
      ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0)
      : null;

    const normalizedEnd = endDate
      ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999)
      : null;

    return this.complaints().filter((c) => {
      const nombreCompleto = `${c.nombre} ${c.apellidos}`.toLowerCase();
      const tipoUsuarioLabel = this.getTipoUsuarioLabel(c.tipoUsuario).toLowerCase();
      const complaintDate = new Date(c.fecha);

      const matchesTerm =
        mode !== 'text' ||
        !term ||
        c.expediente.toLowerCase().includes(term) ||
        nombreCompleto.includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.documento.toLowerCase().includes(term) ||
        tipoUsuarioLabel.includes(term);

      const matchesDateRange =
        mode !== 'date' ||
        !normalizedStart ||
        (complaintDate >= normalizedStart && (!normalizedEnd || complaintDate <= normalizedEnd));

      return (
        (!tipoUsuario || c.tipoUsuario === tipoUsuario) &&
        (!status || c.estado === status) &&
        (!priority || c.prioridad === priority) &&
        matchesTerm &&
        matchesDateRange
      );
    });
  });

  public hasSelectedDateRange = computed(() => {
    // Indica si el DatePicker tiene ambas fechas validas.
    const dateRange = this.selectedDateRange();
    if (!dateRange || dateRange.length < 2) {
      return false;
    }

    const [startDate, endDate] = dateRange;
    if (!startDate || !endDate) {
      return false;
    }

    return !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());
  });

  getTipoUsuarioUi(tipo: TipoUsuarioDenuncia): TipoUsuarioUi {
    return this.tipoUsuarioUi[tipo] ?? this.tipoUsuarioUi['13'];
  }

  getEstadoUi(estado: EstadoDenuncia | null | undefined): EstadoUi {
    if (!estado) {
      return this.estadoUi['Sin Atender'];
    }

    return this.estadoUi[estado] ?? this.estadoUi['Sin Atender'];
  }

  getPrioridadUi(prioridad: PrioridadDenuncia | null | undefined): PrioridadUi {
    if (!prioridad) {
      return {
        badgeClass:
          'inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-500 ring-1 ring-inset ring-slate-300',
        dotClass: 'h-2.5 w-2.5 rounded-full bg-slate-400',
      };
    }

    return this.prioridadUi[prioridad] ?? this.prioridadUi.Baja;
  }

  getEstadoLabel(estado: EstadoDenuncia | null | undefined): string {
    return estado ?? 'Sin Atender';
  }

  getPrioridadLabel(prioridad: PrioridadDenuncia | null | undefined): string {
    return prioridad ?? 'Sin Prioridad';
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

  getCompactEmail(email: string | null | undefined): string {
    const value = email?.trim() ?? '';
    if (!value) {
      return 'Sin correo';
    }

    const [localPart, domainPart] = value.split('@');
    if (!localPart || !domainPart) {
      return value;
    }

    const visibleDomain = domainPart.slice(0, 3);
    const ellipsis = domainPart.length > 3 ? '...' : '';

    return `${localPart}@${visibleDomain}${ellipsis}`;
  }

  getAsignadoNombre(asignado: string | null | undefined): string {
    const value = asignado?.trim() ?? '';
    if (!value) {
      return 'Sin asignar';
    }

    const [firstPart, secondPart] = value.split(' - ').map((item) => item.trim());
    if (secondPart) {
      return secondPart;
    }

    return firstPart;
  }

  getAsignadoCargo(asignado: string | null | undefined): string | null {
    const value = asignado?.trim() ?? '';
    if (!value) {
      return null;
    }

    const [firstPart, secondPart] = value.split(' - ').map((item) => item.trim());
    if (secondPart) {
      return firstPart || null;
    }

    return null;
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

  onDerivarVisibleChange(value: boolean): void {
    this.mostrarModalDerivar.set(value);
    if (!value && !this.mostrarModalDetalle() && !this.mostrarModalResponder()) {
      this.complaintSeleccionado.set(null);
    }
  }

  manejarDerivacion(derivacion: DerivacionDenuncia): void {
    // Refleja en UI la derivacion sin recargar toda la tabla.
    this.complaints.update((lista) =>
      lista.map((item) => {
        if (item.expediente !== derivacion.expediente) return item;
        return { ...item, estado: 'En Proceso' as EstadoDenuncia, asignado: derivacion.destinoId };
      })
    );
    this.mostrarModalDerivar.set(false);
  }

  verHistorialComplaint(complaint: Denuncia): void {
    this.complaintSeleccionado.set(complaint);
    this.mostrarModalHistorial.set(true);
  }

  cerrarModalHistorial(): void {
    this.mostrarModalHistorial.set(false);
  }
}