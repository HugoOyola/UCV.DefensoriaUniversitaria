import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ModalComponent } from '../../../../../core/shared/components/modal/modal.component';
import { Denuncia, TipoUsuarioDenuncia } from '../../../interface/denuncias.interface';

@Component({
  selector: 'app-gestion-modales',
  imports: [CommonModule, ButtonModule, ModalComponent],
  templateUrl: './gestion-modales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionModalesComponent {
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
}
