import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ModalComponent } from '../../../../../../core/shared/components/modal/modal.component';
import { Denuncia, TipoUsuarioDenuncia } from '../../../../interface/denuncias.interface';

interface OpcionSimple {
  label: string;
  value: string;
}

@Component({
  selector: 'app-responder-modal',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    ModalComponent,
  ],
  templateUrl: './responder-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponderModalComponent {
  private readonly document = inject(DOCUMENT);

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
  public readonly enviarRespuesta = output<Denuncia>();

  // ─── Plantillas ───────────────────────────────────────────────────────────
  public readonly plantillasRespuesta: OpcionSimple[] = [
    { label: 'Respuesta estándar', value: 'estandar' },
    { label: 'Solicitud de información adicional', value: 'solicitud' },
    { label: 'Resolución favorable', value: 'favorable' },
    { label: 'Resolución desfavorable', value: 'desfavorable' },
    { label: 'Derivación de caso', value: 'derivacion' },
  ];

  private readonly plantillas: Record<string, string> = {
    estandar: `Estimado(a) [NOMBRE]:

Recibimos su denuncia/reclamo con codigo [EXPEDIENTE] y le informamos que esta siendo atendida por nuestra unidad.

Le estaremos notificando sobre el avance de su caso.

Atentamente,
Defensoria Universitaria`,

    solicitud: `Estimado(a) [NOMBRE]:

En relacion a su denuncia/reclamo con codigo [EXPEDIENTE], necesitamos informacion adicional para continuar con el proceso:

[Especificar informacion requerida]

Por favor, responda a este correo con la informacion solicitada a la brevedad posible.

Atentamente,
Defensoria Universitaria`,

    favorable: `Estimado(a) [NOMBRE]:

Nos complace informarle que su denuncia/reclamo con codigo [EXPEDIENTE] ha sido resuelta favorablemente.

[Detallar resolucion]

Quedamos a su disposicion para cualquier consulta adicional.

Atentamente,
Defensoria Universitaria`,

    desfavorable: `Estimado(a) [NOMBRE]:

En relacion a su denuncia/reclamo con codigo [EXPEDIENTE], luego de revisar su caso, le informamos lo siguiente:

[Detallar motivos]

Si tiene alguna consulta o desea presentar informacion adicional, no dude en contactarnos.

Atentamente,
Defensoria Universitaria`,

    derivacion: `Estimado(a) [NOMBRE]:

Su denuncia/reclamo con codigo [EXPEDIENTE] ha sido derivada a la unidad correspondiente para su atencion.

La unidad responsable se pondra en contacto con usted en breve.

Atentamente,
Defensoria Universitaria`,
  };

  // ─── Signals ──────────────────────────────────────────────────────────────
  public readonly plantillaSeleccionada = signal<string | null>('estandar');
  public readonly asuntoRespuesta = signal('');
  public readonly mensajeRespuesta = signal('');
  public readonly adjuntosRespuesta = signal<File[]>([]);

  // ─── Computed ─────────────────────────────────────────────────────────────
  public readonly modalTitle = computed(() => {
    const c = this.complaint();
    return c ? `Responder Denuncia / Reclamo` : 'Responder';
  });

  public readonly modalBadge = computed(() => this.complaint()?.estado ?? '');

  public readonly inputAdjuntosId = computed(() => {
    const expediente = this.complaint()?.expediente ?? 'caso';
    return `responder-adj-${expediente.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`;
  });

  public readonly puedeEnviarRespuesta = computed(
    () => !!this.complaint() && this.mensajeRespuesta().trim().length >= 15
  );

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const c = this.complaint();
      if (!isVisible || !c) return;

      this.plantillaSeleccionada.set('estandar');
      this.asuntoRespuesta.set(`Respuesta a Denuncia/Reclamo ${c.expediente}`);
      this.mensajeRespuesta.set(this.buildMensaje('estandar', c));
      this.adjuntosRespuesta.set([]);
    });
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────
  onVisibleChange(value: boolean): void {
    this.visibleChange.emit(value);
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  onPlantillaChange(value: string | null): void {
    this.plantillaSeleccionada.set(value);
    const c = this.complaint();
    this.mensajeRespuesta.set(c ? this.buildMensaje(value, c) : '');
  }

  abrirSelectorAdjuntos(): void {
    const input = this.document.getElementById(this.inputAdjuntosId()) as HTMLInputElement | null;
    input?.click();
  }

  onAdjuntosSeleccionados(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.adjuntosRespuesta.update((lista) => [...lista, ...Array.from(input.files ?? [])]);
    input.value = '';
  }

  removeAdjunto(index: number): void {
    this.adjuntosRespuesta.update((lista) => lista.filter((_, i) => i !== index));
  }

  enviarRespuestaCaso(): void {
    const c = this.complaint();
    if (!c || !this.puedeEnviarRespuesta()) return;

    this.enviarRespuesta.emit({ ...c, estado: 'En Proceso' });
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

  getEscuelaLabel(escuela: string | number | null | undefined): string {
    if (escuela == null || escuela === '') return 'No especificado';
    return this.escuelaPorCodigo[String(escuela)] ?? String(escuela);
  }

  getModalidadLabel(modalidad: string | number | null | undefined): string {
    if (modalidad == null || modalidad === '') return 'No especificado';
    return this.modalidadPorCodigo[String(modalidad)] ?? String(modalidad);
  }

  getApoderadoNombre(c: Denuncia): string {
    return (
      `${c.apoderadoNombres?.trim() ?? ''} ${c.apoderadoApellidos?.trim() ?? ''}`.trim() ||
      'No especificado'
    );
  }

  // ─── Private ──────────────────────────────────────────────────────────────
  private buildMensaje(template: string | null, c: Denuncia): string {
    const nombre = `${c.nombre} ${c.apellidos}`.trim() || 'Usuario';
    const base = this.plantillas[template ?? ''] ?? this.plantillas['estandar'];
    return base.replaceAll('[NOMBRE]', nombre).replaceAll('[EXPEDIENTE]', c.expediente);
  }
}
