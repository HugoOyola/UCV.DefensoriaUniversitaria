import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ModalComponent } from '../../../../../core/shared/components/modal/modal.component';
import { Adjunto, Denuncia, EstadoDenuncia, PrioridadDenuncia, TipoUsuarioDenuncia } from '../../../interface/denuncias.interface';

interface OpcionSimple {
  label: string;
  value: string;
}

interface GrupoClasificacion {
  label: string;
  items: OpcionSimple[];
}

@Component({
  selector: 'app-gestion-modales',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, ModalComponent],
  templateUrl: './gestion-modales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionModalesComponent {
  private readonly campusPorFilial: Record<string, string> = {
    '1': 'Lima Norte',
    '2': 'Trujillo',
    '3': 'Chiclayo',
    '4': 'Piura',
    '5': 'Tarapoto',
  };

  private readonly escuelaPorCodigo: Record<string, string> = {
    '101': 'Ingenieria de Sistemas',
    '110': 'Derecho',
    '205': 'Psicologia',
    '210': 'Contabilidad',
    '315': 'Administracion',
    '407': 'Enfermeria',
  };

  private readonly modalidadPorCodigo: Record<string, string> = {
    '5001': 'Presencial',
    '5002': 'Semipresencial',
    '5003': 'Virtual',
  };

  public readonly estadoOptions: OpcionSimple[] = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En Proceso', value: 'En Proceso' },
    { label: 'Resuelto', value: 'Resuelto' },
  ];

  public readonly prioridadOptions: OpcionSimple[] = [
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
  ];

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

  public readonly estadoSeleccionado = signal<EstadoDenuncia>('Pendiente');
  public readonly prioridadSeleccionada = signal<PrioridadDenuncia>('Media');
  public readonly clasificacionSeleccionada = signal<string>('Sin Clasificación');

  public readonly clasificacionModalVisible = signal(false);
  public readonly modoClasificacion = signal<'existente' | 'nuevo'>('existente');
  public readonly grupoExistenteSeleccionado = signal<string | null>(null);
  public readonly nuevoGrupoNombre = signal('');
  public readonly nuevaSubclasificacionNombre = signal('');

  public readonly gruposClasificacionOptions = computed<OpcionSimple[]>(() =>
    this.clasificacionGroups().map((group) => ({ label: group.label, value: group.label }))
  );

  public readonly puedeGuardarClasificacion = computed(() => {
    const subclasificacion = this.nuevaSubclasificacionNombre().trim();
    if (!subclasificacion) {
      return false;
    }

    if (this.modoClasificacion() === 'existente') {
      return !!this.grupoExistenteSeleccionado();
    }

    return !!this.nuevoGrupoNombre().trim();
  });

  public readonly detalleVisible = input<boolean>(false);
  public readonly complaint = input<Denuncia | null>(null);

  public readonly detalleVisibleChange = output<boolean>();
  public readonly guardarCambios = output<Denuncia>();

  public readonly detalleModalTitle = computed(() => {
    const currentComplaint = this.complaint();
    return currentComplaint
      ? `Detalle del expediente ${currentComplaint.expediente}`
      : 'Detalle de denuncia / reclamo';
  });

  public readonly detalleModalSubtitle = computed(() => {
    const currentComplaint = this.complaint();
    return currentComplaint ? `${currentComplaint.nombre} ${currentComplaint.apellidos}` : '';
  });

  public readonly detalleModalBadge = computed(() => {
    const currentComplaint = this.complaint();
    return currentComplaint ? currentComplaint.estado : '';
  });

  constructor() {
    effect(() => {
      const currentComplaint = this.complaint();
      if (!currentComplaint) {
        return;
      }

      this.estadoSeleccionado.set(currentComplaint.estado);
      this.prioridadSeleccionada.set(currentComplaint.prioridad);

      const clasificacion = currentComplaint.clasificacion?.trim() || 'Sin Clasificación';
      this.ensureClasificacionExists(clasificacion);
      this.clasificacionSeleccionada.set(clasificacion);
    });
  }

  onDetalleVisibleChange(value: boolean): void {
    this.detalleVisibleChange.emit(value);
  }

  closeDetalle(): void {
    this.detalleVisibleChange.emit(false);
  }

  saveChanges(): void {
    const currentComplaint = this.complaint();
    if (!currentComplaint) {
      return;
    }

    const updatedComplaint: Denuncia = {
      ...currentComplaint,
      estado: this.estadoSeleccionado(),
      prioridad: this.prioridadSeleccionada(),
      clasificacion: this.clasificacionSeleccionada(),
    };

    this.guardarCambios.emit(updatedComplaint);
    this.detalleVisibleChange.emit(false);
  }

  getAreasPrevias(complaint: Denuncia): string[] {
    const result: string[] = [];

    if (complaint.otraArea.libro) result.push('Libro de Reclamaciones');
    if (complaint.otraArea.tribunal) result.push('Tribunal de Honor');
    if (complaint.otraArea.comision) result.push('Comisión de Hostigamiento');
    if (complaint.otraArea.direccion) result.push('Dirección General');
    if (complaint.otraArea.secretaria) result.push('Secretaría General');
    if (complaint.otraArea.cap) result.push('Centro de Atención Personalizada');
    if (complaint.otraArea.otro) {
      const detalleOtro = complaint.otraAreaOtro?.trim();
      result.push(detalleOtro ? `Otro: ${detalleOtro}` : 'Otro (sin especificar)');
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
    if (filial === null || filial === undefined || filial === '') {
      return 'No especificado';
    }

    return this.campusPorFilial[String(filial)] ?? String(filial);
  }

  getEscuelaLabel(escuela: string | number | null | undefined): string {
    if (escuela === null || escuela === undefined || escuela === '') {
      return 'No especificado';
    }

    return this.escuelaPorCodigo[String(escuela)] ?? String(escuela);
  }

  getModalidadLabel(modalidad: string | number | null | undefined): string {
    if (modalidad === null || modalidad === undefined || modalidad === '') {
      return 'No especificado';
    }

    return this.modalidadPorCodigo[String(modalidad)] ?? String(modalidad);
  }

  getPresentadoPorLabel(complaint: Denuncia): string {
    return complaint.isApoderado ? 'Apoderado' : 'Titular';
  }

  getApoderadoNombre(complaint: Denuncia): string {
    const nombres = complaint.apoderadoNombres?.trim() ?? '';
    const apellidos = complaint.apoderadoApellidos?.trim() ?? '';

    return `${nombres} ${apellidos}`.trim() || 'No especificado';
  }

  getAdjuntoMeta(adjunto: Adjunto): string {
    const metadata: string[] = [];

    if (adjunto.tipo?.trim()) {
      metadata.push(adjunto.tipo.toUpperCase());
    }

    if (typeof adjunto.tamanio === 'number' && adjunto.tamanio > 0) {
      metadata.push(this.formatFileSize(adjunto.tamanio));
    }

    return metadata.length > 0 ? metadata.join(' · ') : 'Documento adjunto';
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
    if (!this.puedeGuardarClasificacion()) {
      return;
    }

    const subclasificacion = this.nuevaSubclasificacionNombre().trim();

    if (this.modoClasificacion() === 'existente') {
      this.addClasificacionToGroup(this.grupoExistenteSeleccionado() ?? '', subclasificacion);
    } else {
      this.addClasificacionToGroup(this.nuevoGrupoNombre().trim(), subclasificacion);
    }

    this.clasificacionSeleccionada.set(subclasificacion);
    this.closeClasificacionModal();
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
  }

  private addClasificacionToGroup(groupName: string, subclasificacion: string): void {
    const groupNameNormalized = groupName.trim();
    const subclasificacionNormalized = subclasificacion.trim();
    if (!groupNameNormalized || !subclasificacionNormalized) {
      return;
    }

    const groups = this.clasificacionGroups();
    const groupIndex = groups.findIndex(
      (group) => group.label.toLowerCase() === groupNameNormalized.toLowerCase()
    );

    if (groupIndex < 0) {
      this.clasificacionGroups.set([
        ...groups,
        {
          label: groupNameNormalized,
          items: [{ label: subclasificacionNormalized, value: subclasificacionNormalized }],
        },
      ]);
      return;
    }

    const targetGroup = groups[groupIndex];
    const alreadyExists = targetGroup.items.some(
      (item) => item.value.toLowerCase() === subclasificacionNormalized.toLowerCase()
    );

    if (alreadyExists) {
      return;
    }

    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = {
      ...targetGroup,
      items: [
        ...targetGroup.items,
        { label: subclasificacionNormalized, value: subclasificacionNormalized },
      ],
    };

    this.clasificacionGroups.set(updatedGroups);
  }

  private ensureClasificacionExists(clasificacion: string): void {
    const clasificacionNormalized = clasificacion.trim();
    if (!clasificacionNormalized) {
      return;
    }

    const exists = this.clasificacionGroups()
      .some((group) => group.items.some((item) => item.value.toLowerCase() === clasificacionNormalized.toLowerCase()));

    if (exists) {
      return;
    }

    this.addClasificacionToGroup('General', clasificacionNormalized);
  }
}
