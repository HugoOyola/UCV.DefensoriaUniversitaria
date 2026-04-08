import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ModalComponent } from '../../../../../core/shared/components/modal/modal.component';
import { Adjunto, Denuncia, TipoUsuarioDenuncia } from '../../../interface/denuncias.interface';

@Component({
  selector: 'app-gestion-modales',
  imports: [CommonModule, ButtonModule, ModalComponent],
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

  public readonly detalleVisible = input<boolean>(false);
  public readonly complaint = input<Denuncia | null>(null);

  public readonly detalleVisibleChange = output<boolean>();

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

  onDetalleVisibleChange(value: boolean): void {
    this.detalleVisibleChange.emit(value);
  }

  closeDetalle(): void {
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
      result.push(complaint.otraAreaOtro?.trim() || 'Otro');
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
}
