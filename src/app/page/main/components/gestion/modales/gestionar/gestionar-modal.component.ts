import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ModalComponent } from '../../../../../../core/shared/components/modal/modal.component';
import {
  Adjunto,
  Denuncia,
  EstadoDenuncia,
  PrioridadDenuncia,
  TipoUsuarioDenuncia,
} from '../../../../interface/denuncias.interface';

interface OpcionSimple {
  label: string;
  value: string;
}

interface GrupoClasificacion {
  label: string;
  items: OpcionSimple[];
}

@Component({
  selector: 'app-gestionar-modal',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, ModalComponent],
  templateUrl: './gestionar-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionarModalComponent {
  private readonly campusPorFilial: Record<string, string> = {
    '1': 'Lima Norte',
    '2': 'Trujillo',
    '3': 'Chiclayo',
    '4': 'Piura',
    '5': 'Tarapoto',
  };

  private readonly escuelaPorCodigo: Record<string, string> = {
    '101': 'Ingeniería de Sistemas',
    '110': 'Derecho',
    '205': 'Psicología',
    '210': 'Contabilidad',
    '315': 'Administración',
    '407': 'Enfermería',
  };

  private readonly modalidadPorCodigo: Record<string, string> = {
    '5001': 'Presencial',
    '5002': 'Semipresencial',
    '5003': 'Virtual',
  };

  // ─── Inputs / Outputs ─────────────────────────────────────────────────────
  public readonly visible = input<boolean>(false);
  public readonly complaint = input<Denuncia | null>(null);

  public readonly visibleChange = output<boolean>();
  public readonly guardarCambios = output<Denuncia>();

  // ─── Options ──────────────────────────────────────────────────────────────
  public readonly prioridadOptions: OpcionSimple[] = [
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
  ];

  // ─── Signals ──────────────────────────────────────────────────────────────
  public readonly clasificacionGroups = signal<GrupoClasificacion[]>([
    {
      label: 'General',
      items: [{ label: 'Sin Clasificación', value: 'Sin Clasificación' }],
    },
    {
      label: 'Institucional',
      items: [
        { label: 'Académico', value: 'Académico' },
        { label: 'Administrativo', value: 'Administrativo' },
      ],
    },
  ]);

  public readonly estadoSeleccionado = signal<EstadoDenuncia | null>(null);
  public readonly prioridadSeleccionada = signal<PrioridadDenuncia | null>(null);
  public readonly clasificacionSeleccionada = signal<string | null>(null);

  public readonly clasificacionModalVisible = signal(false);
  public readonly modoClasificacion = signal<'existente' | 'nuevo'>('existente');
  public readonly grupoExistenteSeleccionado = signal<string | null>(null);
  public readonly nuevoGrupoNombre = signal('');
  public readonly nuevaSubclasificacionNombre = signal('');
  public readonly intentoGuardarCaso = signal(false);

  // ─── Computed ─────────────────────────────────────────────────────────────
  public readonly modalTitle = computed(() => {
    const c = this.complaint();
    return c ? `Detalle del expediente ${c.expediente}` : 'Detalle de denuncia / reclamo';
  });

  public readonly modalSubtitle = computed(() => {
    const c = this.complaint();
    return c ? `${c.nombre} ${c.apellidos}` : '';
  });

  public readonly modalBadge = computed(() => this.complaint()?.estado ?? 'Sin Atender');

  public readonly gruposClasificacionOptions = computed<OpcionSimple[]>(() =>
    this.clasificacionGroups().map((g) => ({ label: g.label, value: g.label }))
  );

  public readonly puedeGuardarClasificacion = computed(() => {
    const sub = this.nuevaSubclasificacionNombre().trim();
    if (!sub) return false;
    return this.modoClasificacion() === 'existente'
      ? !!this.grupoExistenteSeleccionado()
      : !!this.nuevoGrupoNombre().trim();
  });

  public readonly puedeGuardarCaso = computed(() => {
    const prioridad = this.prioridadSeleccionada();
    const clasificacion = this.clasificacionSeleccionada();
    return !!prioridad && !!clasificacion && clasificacion !== 'Sin Clasificación';
  });

  public readonly prioridadInvalida = computed(
    () => this.intentoGuardarCaso() && !this.prioridadSeleccionada()
  );

  public readonly clasificacionInvalida = computed(() => {
    const clasificacion = this.clasificacionSeleccionada();
    return this.intentoGuardarCaso() && (!clasificacion || clasificacion === 'Sin Clasificación');
  });

  constructor() {
    effect(() => {
      const c = this.complaint();
      if (!c) return;

      this.estadoSeleccionado.set(c.estado ?? null);
      this.prioridadSeleccionada.set(c.prioridad ?? null);

      const clasificacion = c.clasificacion?.trim() || null;
      if (clasificacion) {
        this.ensureClasificacionExists(clasificacion);
      }
      this.clasificacionSeleccionada.set(clasificacion);
      this.intentoGuardarCaso.set(false);
    });
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────
  onVisibleChange(value: boolean): void {
    this.visibleChange.emit(value);
  }

  close(): void {
    this.intentoGuardarCaso.set(false);
    this.visibleChange.emit(false);
  }

  saveChanges(): void {
    const c = this.complaint();
    if (!c) return;

    this.intentoGuardarCaso.set(true);
    if (!this.puedeGuardarCaso()) {
      return;
    }

    const prioridad = this.prioridadSeleccionada();
    const clasificacion = this.clasificacionSeleccionada();
    const estadoActual = this.estadoSeleccionado();

    const tieneConfiguracion = !!prioridad && !!clasificacion && clasificacion !== 'Sin Clasificación';

    const nuevoEstado: EstadoDenuncia =
      tieneConfiguracion && (!estadoActual || estadoActual === 'Sin Atender')
        ? 'En Proceso'
        : (estadoActual ?? 'Sin Atender');

    this.guardarCambios.emit({
      ...c,
      estado: nuevoEstado,
      prioridad,
      clasificacion,
    });

    this.intentoGuardarCaso.set(false);
    this.visibleChange.emit(false);
  }

  openClasificacionModal(): void {
    this.modoClasificacion.set('existente');
    this.grupoExistenteSeleccionado.set(this.clasificacionGroups()[0]?.label ?? null);
    this.nuevoGrupoNombre.set('');
    this.nuevaSubclasificacionNombre.set('');
    this.clasificacionModalVisible.set(true);
  }

  closeClasificacionModal(): void {
    this.clasificacionModalVisible.set(false);
  }

  guardarClasificacion(): void {
    if (!this.puedeGuardarClasificacion()) return;

    const sub = this.nuevaSubclasificacionNombre().trim();
    const group =
      this.modoClasificacion() === 'existente'
        ? (this.grupoExistenteSeleccionado() ?? '')
        : this.nuevoGrupoNombre().trim();

    this.addClasificacionToGroup(group, sub);
    this.clasificacionSeleccionada.set(sub);
    this.closeClasificacionModal();
  }

  // ─── View helpers ─────────────────────────────────────────────────────────
  getAreasPrevias(c: Denuncia): string[] {
    const result: string[] = [];
    if (c.otraArea.libro) result.push('Libro de Reclamaciones');
    if (c.otraArea.tribunal) result.push('Tribunal de Honor');
    if (c.otraArea.comision) result.push('Comisión de Hostigamiento');
    if (c.otraArea.direccion) result.push('Dirección General');
    if (c.otraArea.secretaria) result.push('Secretaría General');
    if (c.otraArea.cap) result.push('Centro de Atención Personalizada');
    if (c.otraArea.otro) {
      result.push(c.otraAreaOtro?.trim() ? `Otro: ${c.otraAreaOtro.trim()}` : 'Otro (sin especificar)');
    }
    return result;
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

  getCampusLabel(filial: string | number | null | undefined): string {
    if (filial == null || filial === '') return 'No especificado';
    return this.campusPorFilial[String(filial)] ?? String(filial);
  }

  getEscuelaLabel(escuela: string | number | null | undefined): string {
    if (escuela == null || escuela === '') return 'No especificado';
    return this.escuelaPorCodigo[String(escuela)] ?? String(escuela);
  }

  getModalidadLabel(modalidad: string | number | null | undefined): string {
    if (modalidad == null || modalidad === '') return 'No especificado';
    return this.modalidadPorCodigo[String(modalidad)] ?? String(modalidad);
  }

  getPresentadoPorLabel(c: Denuncia): string {
    return c.isApoderado ? 'Apoderado' : 'Titular';
  }

  getApoderadoNombre(c: Denuncia): string {
    return (
      `${c.apoderadoNombres?.trim() ?? ''} ${c.apoderadoApellidos?.trim() ?? ''}`.trim() ||
      'No especificado'
    );
  }

  getAdjuntoMeta(adjunto: Adjunto): string {
    const meta: string[] = [];
    if (adjunto.tipo?.trim()) meta.push(adjunto.tipo.toUpperCase());
    if (typeof adjunto.tamanio === 'number' && adjunto.tamanio > 0) {
      meta.push(this.formatFileSize(adjunto.tamanio));
    }
    return meta.join(' · ') || 'Documento adjunto';
  }

  // ─── Private helpers ──────────────────────────────────────────────────────
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  }

  private addClasificacionToGroup(groupName: string, sub: string): void {
    const gName = groupName.trim();
    const sName = sub.trim();
    if (!gName || !sName) return;

    const groups = this.clasificacionGroups();
    const idx = groups.findIndex((g) => g.label.toLowerCase() === gName.toLowerCase());

    if (idx < 0) {
      this.clasificacionGroups.set([
        ...groups,
        { label: gName, items: [{ label: sName, value: sName }] },
      ]);
      return;
    }

    const target = groups[idx];
    if (target.items.some((i) => i.value.toLowerCase() === sName.toLowerCase())) return;

    const updated = [...groups];
    updated[idx] = { ...target, items: [...target.items, { label: sName, value: sName }] };
    this.clasificacionGroups.set(updated);
  }

  private ensureClasificacionExists(clasificacion: string): void {
    const n = clasificacion.trim();
    if (!n) return;
    if (
      this.clasificacionGroups().some((g) =>
        g.items.some((i) => i.value.toLowerCase() === n.toLowerCase())
      )
    )
      return;
    this.addClasificacionToGroup('General', n);
  }
}
