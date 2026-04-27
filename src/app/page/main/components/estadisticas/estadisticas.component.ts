import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DenunciasService} from '../../services/denuncias.service';
import {Denuncia, EstadisticasDenuncia, EstadoDenuncia, PrioridadDenuncia, TipoUsuarioDenuncia} from '../../interface/denuncias.interface';

interface SerieEstadoItem {
	estado: EstadoDenuncia;
	cantidad: number;
	porcentaje: number;
	barraClass: string;
}

interface TopCampusItem {
	campus: string;
	total: number;
}

@Component({
	selector: 'app-estadisticas',
	imports: [DatePipe],
	templateUrl: './estadisticas.component.html',
	styleUrl: './estadisticas.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasComponent {
	private readonly denunciasService = inject(DenunciasService);

	public readonly cargando = signal(true);
	public readonly errorCarga = signal<string | null>(null);
	public readonly denuncias = signal<Denuncia[]>([]);

	private readonly tipoUsuarioLabel: Record<TipoUsuarioDenuncia, string> = {
		'13': 'Estudiantes',
		'12': 'Docentes',
		'21': 'Administrativos',
		'14': 'Egresados',
		'72': 'Graduados',
	};

	private readonly campusPorFilial: Record<string, string> = {
		'1': 'Lima Norte',
		'2': 'Trujillo',
		'3': 'Chiclayo',
		'4': 'Piura',
		'5': 'Tarapoto',
	};

	public readonly resumen = computed<EstadisticasDenuncia>(() => {
		// Consolidado base; de aqui salen todas las series de la vista.
		const lista = this.denuncias();
		const inicial: EstadisticasDenuncia = {
			total: lista.length,
			pendientes: 0,
			enProceso: 0,
			resueltas: 0,
			porTipoUsuario: {
				'13': 0,
				'12': 0,
				'21': 0,
				'14': 0,
				'72': 0,
			},
			porPrioridad: {
				Alta: 0,
				Media: 0,
				Baja: 0,
			},
		};

		for (const denuncia of lista) {
			if (denuncia.estado === 'Pendiente') inicial.pendientes += 1;
			if (denuncia.estado === 'En Proceso') inicial.enProceso += 1;
			if (denuncia.estado === 'Resuelto') inicial.resueltas += 1;
			inicial.porTipoUsuario[denuncia.tipoUsuario] += 1;
			if (denuncia.prioridad) {
				inicial.porPrioridad[denuncia.prioridad] += 1;
			}
		}

		return inicial;
	});

	public readonly serieEstado = computed<SerieEstadoItem[]>(() => {
		// Serie para barras por estado (incluye "Sin Atender" derivado).
		const total = this.resumen().total;
		const sinAtender = this.denuncias().filter((x) => !x.estado || x.estado === 'Sin Atender').length;
		return [
			{estado: 'Sin Atender', cantidad: sinAtender, porcentaje: this.getPorcentaje(sinAtender, total), barraClass: 'bg-slate-400'},
			{estado: 'Pendiente', cantidad: this.resumen().pendientes, porcentaje: this.getPorcentaje(this.resumen().pendientes, total), barraClass: 'bg-red-500'},
			{estado: 'En Proceso', cantidad: this.resumen().enProceso, porcentaje: this.getPorcentaje(this.resumen().enProceso, total), barraClass: 'bg-blue-500'},
			{estado: 'Resuelto', cantidad: this.resumen().resueltas, porcentaje: this.getPorcentaje(this.resumen().resueltas, total), barraClass: 'bg-emerald-500'},
		];
	});

	public readonly seriePrioridad = computed<Array<{prioridad: PrioridadDenuncia; cantidad: number; porcentaje: number}>>(() => {
		// Serie de prioridad usando el consolidado del resumen.
		const total = this.resumen().total;
		return [
			{prioridad: 'Alta', cantidad: this.resumen().porPrioridad.Alta, porcentaje: this.getPorcentaje(this.resumen().porPrioridad.Alta, total)},
			{prioridad: 'Media', cantidad: this.resumen().porPrioridad.Media, porcentaje: this.getPorcentaje(this.resumen().porPrioridad.Media, total)},
			{prioridad: 'Baja', cantidad: this.resumen().porPrioridad.Baja, porcentaje: this.getPorcentaje(this.resumen().porPrioridad.Baja, total)},
		];
	});

	public readonly serieTipoUsuario = computed<Array<{tipo: string; cantidad: number; porcentaje: number}>>(() => {
		// Ranking por tipo de usuario para la tabla/grafico de distribucion.
		const total = this.resumen().total;
		const porTipo = this.resumen().porTipoUsuario;
		return (Object.keys(porTipo) as TipoUsuarioDenuncia[])
			.map((tipo) => ({
				tipo: this.tipoUsuarioLabel[tipo],
				cantidad: porTipo[tipo],
				porcentaje: this.getPorcentaje(porTipo[tipo], total),
			}))
			.sort((a, b) => b.cantidad - a.cantidad);
	});

	public readonly topCampus = computed<TopCampusItem[]>(() => {
		// Ranking de campus por volumen de denuncias.
		const acumulado = this.denuncias().reduce((acc, denuncia) => {
			const campus = this.obtenerCampus(denuncia.filial);
			acc[campus] = (acc[campus] ?? 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(acumulado)
			.map(([campus, total]) => ({campus, total}))
			.sort((a, b) => b.total - a.total);
	});

	public readonly ultimaActualizacion = computed<Date | null>(() => {
		const lista = this.denuncias();
		if (lista.length === 0) return null;
		return new Date(Math.max(...lista.map((d) => d.fecha.getTime())));
	});

	constructor() {
		// Carga inicial de estadisticas.
		this.cargar();
	}

	private cargar(): void {
		this.cargando.set(true);
		this.errorCarga.set(null);

		this.denunciasService.listarDenuncias({ idPerfil: 12 }).subscribe({
			next: (data) => {
				this.denuncias.set(data);
			},
			error: () => {
				this.denuncias.set([]);
				this.errorCarga.set('No se pudo cargar las estadísticas desde el servicio centralizado.');
				this.cargando.set(false);
			},
			complete: () => {
				this.cargando.set(false);
			},
		});
	}

	private getPorcentaje(valor: number, total: number): number {
		// Evita division por cero y estandariza el redondeo.
		if (!total) return 0;
		return Number(((valor / total) * 100).toFixed(1));
	}

	private obtenerCampus(filial: string | number | null): string {
		if (filial === null || filial === '') {
			return 'Sin campus';
		}
		return this.campusPorFilial[String(filial)] ?? `Filial ${filial}`;
	}
}
