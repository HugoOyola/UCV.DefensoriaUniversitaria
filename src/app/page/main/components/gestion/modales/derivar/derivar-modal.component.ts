import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ModalComponent } from '../../../../../../core/shared/components/modal/modal.component';
import { Denuncia, DerivacionDenuncia, TipoUsuarioDenuncia } from '../../../../interface/denuncias.interface';

interface OpcionSimple {
  label: string;
  value: string;
}

@Component({
  selector: 'app-derivar-modal',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, TextareaModule, ModalComponent],
  templateUrl: './derivar-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DerivarModalComponent {
  private readonly campusPorFilial: Record<string, string> = {
    '1': 'Lima Norte',
    '2': 'Trujillo',
    '3': 'Chiclayo',
    '4': 'Piura',
    '5': 'Tarapoto',
  };

  // ─── Inputs / Outputs ─────────────────────────────────────────────────────
  public readonly visible = input<boolean>(false);
  public readonly complaint = input<Denuncia | null>(null);

  public readonly visibleChange = output<boolean>();
  public readonly confirmarDerivacion = output<DerivacionDenuncia>();

  // ─── Mock: opciones de destino ────────────────────────────────────────────
  public readonly areasDestino: OpcionSimple[] = [
    { label: 'Dirección Académica', value: 'DIR_ACADEMICA' },
    { label: 'Secretaría Académica', value: 'SEC_ACADEMICA' },
    { label: 'Bienestar Universitario', value: 'BIENESTAR' },
    { label: 'Centro de Atención Personalizada (CAP)', value: 'CAP' },
    { label: 'Tribunal de Honor', value: 'TRIBUNAL_HONOR' },
    { label: 'Comisión de Hostigamiento', value: 'COM_HOSTIGAMIENTO' },
    { label: 'Tesorería', value: 'TESORERIA' },
    { label: 'Registro Académico', value: 'REGISTRO_ACADEMICO' },
    { label: 'Coordinación de Tutoría', value: 'COORD_TUTORIA' },
    { label: 'Tecnologías de Información', value: 'TI' },
  ];

  public readonly programasDestino: OpcionSimple[] = [
    { label: 'Ingeniería de Sistemas', value: '101' },
    { label: 'Derecho', value: '110' },
    { label: 'Psicología', value: '205' },
    { label: 'Contabilidad', value: '210' },
    { label: 'Administración', value: '315' },
    { label: 'Enfermería', value: '407' },
  ];

  // ─── Signals ──────────────────────────────────────────────────────────────
  public readonly tipoDestino = signal<'area' | 'programa'>('area');
  public readonly destinoId = signal<string>('');
  public readonly motivo = signal<string>('');

  // ─── Computed ─────────────────────────────────────────────────────────────
  public readonly modalTitle = computed(() => {
    const c = this.complaint();
    return c ? `Derivar expediente ${c.expediente}` : 'Derivar caso';
  });

  public readonly modalBadge = computed(() => this.complaint()?.estado ?? '');

  public readonly destinoOptions = computed<OpcionSimple[]>(() =>
    this.tipoDestino() === 'area' ? this.areasDestino : this.programasDestino
  );

  public readonly destinoSeleccionadoLabel = computed<string>(() => {
    const id = this.destinoId();
    if (!id) return '';
    const lista = this.destinoOptions();
    return lista.find((o) => o.value === id)?.label ?? id;
  });

  public readonly puedeConfirmar = computed(
    () =>
      !!this.complaint() &&
      this.destinoId().trim().length > 0 &&
      this.motivo().trim().length >= 10
  );

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      if (!isVisible) return;

      this.tipoDestino.set('area');
      this.destinoId.set('');
      this.motivo.set('');
    });
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────
  onVisibleChange(value: boolean): void {
    this.visibleChange.emit(value);
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  onTipoDestinoChange(tipo: 'area' | 'programa'): void {
    this.tipoDestino.set(tipo);
    this.destinoId.set('');
  }

  confirmar(): void {
    const c = this.complaint();
    if (!c || !this.puedeConfirmar()) return;

    const derivacion: DerivacionDenuncia = {
      expediente: c.expediente,
      tipoDestino: this.tipoDestino(),
      destinoId: this.destinoId(),
      motivo: this.motivo(),
    };

    this.confirmarDerivacion.emit(derivacion);
    this.visibleChange.emit(false);
  }

  // ─── View helpers ─────────────────────────────────────────────────────────
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
}
