import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonComponent } from '@shared/components/skeleon/skeleton.component';
import { MainService } from '../../services/main.service';
import {
	Denuncia,
	EstadoDenuncia,
	PrioridadDenuncia,
	TipoUsuarioDenuncia
	} from '../../interface/denuncias.interface';

interface OpcionCampus {
	label: string;
	value: string;
}

interface TarjetaResumen {
	titulo: string;
	valor: number | string;
	sufijo?: string;
	insignia?: {
		texto: string;
		tono: 'success' | 'danger' | 'info';
	};
	icono: string;
}

interface DistribucionUsuario {
	etiqueta: string;
	porcentaje: number;
	cantidad: number;
}

interface DenunciaReciente {
	expediente: string;
	fecha: Date;
	campus: string;
	estado: EstadoDenuncia;
	prioridad: PrioridadDenuncia;
}

interface MetricaInferior {
	titulo: string;
	valor: number | string;
	subtitulo: string;
	progreso: number;
	icono: string;
}

@Component({
	selector: 'app-inicio',
	imports: [
		ReactiveFormsModule,
		DatePipe,
		ButtonModule,
		TableModule,
		TagModule,
		SelectModule,
		TooltipModule,
		SkeletonComponent
	],
	templateUrl: './inicio.component.html',
	styleUrl: './inicio.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioComponent {
	private readonly _mainService = inject(MainService);
	private readonly _router = inject(Router);
	private static readonly LIMITE_DENUNCIAS = 5;

	private readonly campusPorFilial: Record<string, string> = {
		'1': 'Lima Norte',
		'2': 'Trujillo',
		'3': 'Chiclayo',
		'4': 'Piura',
		'5': 'Tarapoto'
	};

	private readonly nombreTipoUsuario: Record<TipoUsuarioDenuncia, string> = {
		'13': 'Estudiantes',
		'12': 'Docentes',
		'21': 'Personal administrativo',
		'14': 'Egresados',
		'72': 'Graduados'
	};

	public readonly denuncias = signal<Denuncia[]>([]);
	public readonly cargando = signal<boolean>(true);
	public readonly opcionesCampus = computed<OpcionCampus[]>(() => {
		const opciones = Array.from(
			new Set(this.denuncias().map((denuncia) => this.obtenerNombreCampus(denuncia.filial)))
		)
			.filter(Boolean)
			.sort((campusA, campusB) => campusA.localeCompare(campusB));

		return [
			{ label: 'Todos los campus', value: 'all' },
			...opciones.map((campus) => ({ label: campus, value: campus }))
		];
	});

	public readonly campusControl = new FormControl<OpcionCampus>(
		{ label: 'Todos los campus', value: 'all' },
		{ nonNullable: true }
	);

	private readonly campusSeleccionado = toSignal(
		this.campusControl.valueChanges.pipe(startWith(this.campusControl.value)),
		{ initialValue: this.campusControl.value }
	);

	public readonly tarjetasResumen = computed<TarjetaResumen[]>(() => {
		const denuncias = this.denuncias();
		const total = denuncias.length;
		const pendientes = denuncias.filter((denuncia) => denuncia.estado === 'Pendiente').length;
		const resueltas = denuncias.filter((denuncia) => denuncia.estado === 'Resuelto').length;
		const altaPrioridad = denuncias.filter((denuncia) => denuncia.prioridad === 'Alta').length;

		return [
			{
				titulo: 'Total de denuncias',
				valor: total,
				insignia: { texto: `${this.redondearPorcentaje(total, total)} registradas`, tono: 'info' },
				icono: 'pi pi-file'
			},
			{
				titulo: 'Pendientes de atención',
				valor: pendientes,
				insignia: { texto: `${this.redondearPorcentaje(pendientes, total)} del total`, tono: 'danger' },
				icono: 'pi pi-clock'
			},
			{
				titulo: 'Casos resueltos',
				valor: resueltas,
				insignia: { texto: `${this.redondearPorcentaje(resueltas, total)} de cierre`, tono: 'success' },
				icono: 'pi pi-check-circle'
			},
			{
				titulo: 'Alta prioridad',
				valor: altaPrioridad,
				insignia: { texto: `${this.redondearPorcentaje(altaPrioridad, total)} críticas`, tono: 'danger' },
				icono: 'pi pi-exclamation-triangle'
			}
		];
	});

	public readonly distribucionUsuarios = computed<DistribucionUsuario[]>(() => {
		const total = this.denuncias().length;
		const conteo = this.denuncias().reduce((acumulado, denuncia) => {
			const tipo = denuncia.tipoUsuario;
			acumulado[tipo] = (acumulado[tipo] ?? 0) + 1;
			return acumulado;
		}, {} as Record<TipoUsuarioDenuncia, number>);

		return (Object.entries(conteo) as [TipoUsuarioDenuncia, number][])
			.map(([tipo, cantidad]) => ({
				etiqueta: this.nombreTipoUsuario[tipo as TipoUsuarioDenuncia],
				cantidad,
				porcentaje: this.calcularPorcentaje(cantidad, total)
			}))
			.sort((itemA, itemB) => itemB.cantidad - itemA.cantidad);
	});

	public readonly denunciasRecientes = computed<DenunciaReciente[]>(() =>
		[...this.denuncias()]
			.sort((denunciaA, denunciaB) => denunciaB.fecha.getTime() - denunciaA.fecha.getTime())
			.map((denuncia) => ({
				expediente: denuncia.expediente,
				fecha: denuncia.fecha,
				campus: this.obtenerNombreCampus(denuncia.filial),
				estado: denuncia.estado,
				prioridad: denuncia.prioridad
			}))
	);

	public readonly denunciasFiltradas = computed(() => {
		const campus = this.campusSeleccionado()?.value ?? 'all';
		const denunciasFiltradas =
			campus === 'all'
				? this.denunciasRecientes()
				: this.denunciasRecientes().filter((denuncia) => denuncia.campus === campus);

		return denunciasFiltradas.slice(0, InicioComponent.LIMITE_DENUNCIAS);
	});

	public readonly metricasInferiores = computed<MetricaInferior[]>(() => {
		const denuncias = this.denuncias();
		const total = denuncias.length;
		const conApoderado = denuncias.filter((denuncia) => denuncia.isApoderado).length;
		const conAdjuntos = denuncias.filter((denuncia) => (denuncia.adjuntos?.length ?? 0) > 0).length;
		const derivadas = denuncias.filter((denuncia) => this.tieneOtraAreaMarcada(denuncia)).length;

		return [
			{
				titulo: 'Casos con apoderado',
				valor: conApoderado,
				subtitulo: `${this.redondearPorcentaje(conApoderado, total)} del total`,
				progreso: this.calcularPorcentaje(conApoderado, total),
				icono: 'pi pi-users'
			},
			{
				titulo: 'Expedientes con adjuntos',
				valor: conAdjuntos,
				subtitulo: `${this.redondearPorcentaje(conAdjuntos, total)} documentados`,
				progreso: this.calcularPorcentaje(conAdjuntos, total),
				icono: 'pi pi-paperclip'
			},
			{
				titulo: 'Casos derivados a otras áreas',
				valor: derivadas,
				subtitulo: `${this.redondearPorcentaje(derivadas, total)} requieren seguimiento`,
				progreso: this.calcularPorcentaje(derivadas, total),
				icono: 'pi pi-send'
			}
		];
	});

	constructor() {
		effect(() => {
			this.campusSeleccionado();
		});

		this.cargarDenuncias();
	}

	irAGestion(): void {
		void this._router.navigate(['/gestion']);
	}

	obtenerSeveridadEstado(
		estado: EstadoDenuncia
	): 'success' | 'danger' | 'info' | 'secondary' {
		switch (estado) {
			case 'Resuelto':
				return 'success';
			case 'Pendiente':
				return 'danger';
			case 'En Proceso':
				return 'info';
			default:
				return 'secondary';
		}
	}

	obtenerSeveridadPrioridad(prioridad: PrioridadDenuncia): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
		switch (prioridad) {
			case 'Alta':
				return 'danger';
			case 'Media':
				return 'warn';
			case 'Baja':
				return 'success';
			default:
				return 'secondary';
		}
	}

	obtenerClaseInsignia(tono: 'success' | 'danger' | 'info'): string {
		switch (tono) {
			case 'success':
				return 'bg-emerald-100 text-emerald-700';
			case 'danger':
				return 'bg-rose-100 text-rose-700';
			case 'info':
				return 'bg-sky-100 text-sky-700';
			default:
				return 'bg-slate-100 text-slate-700';
		}
	}

	private cargarDenuncias(): void {
		this.cargando.set(true);

		this._mainService
			.post_Main_ObtenerDenuncias()
			.subscribe({
				next: (response) => {
					this.denuncias.set(response.body?.lstItem ?? []);
				},
				error: () => {
					this.denuncias.set([]);
					this.cargando.set(false);
				},
				complete: () => {
					this.cargando.set(false);
				}
			});
	}

	private obtenerNombreCampus(filial: string | number | null | undefined): string {
		if (filial === null || filial === undefined || filial === '') {
			return 'Sin campus';
		}

		return this.campusPorFilial[String(filial)] ?? `Filial ${filial}`;
	}

	private calcularPorcentaje(valor: number, total: number): number {
		if (total === 0) {
			return 0;
		}

		return Number(((valor / total) * 100).toFixed(1));
	}

	private redondearPorcentaje(valor: number, total: number): string {
		return `${this.calcularPorcentaje(valor, total)}%`;
	}

	private tieneOtraAreaMarcada(denuncia: Denuncia): boolean {
		return Object.values(denuncia.otraArea).some(Boolean);
	}
}