import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MainService} from '../../services/main.service';
import {Denuncia, EstadoDenuncia, PrioridadDenuncia} from '../../interface/denuncias.interface';

interface ReporteCampus {
	campus: string;
	total: number;
	pendientes: number;
	enProceso: number;
	resueltos: number;
}

@Component({
	selector: 'app-reportes',
	imports: [DatePipe, FormsModule],
	templateUrl: './reportes.component.html',
	styleUrl: './reportes.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [MainService],
})
export class ReportesComponent {
	private readonly mainService = inject(MainService);

	public readonly cargando = signal(true);
	public readonly errorCarga = signal<string | null>(null);
	public readonly denuncias = signal<Denuncia[]>([]);

	public readonly filtroEstado = signal<EstadoDenuncia | 'Todos'>('Todos');
	public readonly filtroPrioridad = signal<PrioridadDenuncia | 'Todos'>('Todos');
	public readonly filtroCampus = signal<string>('Todos');
	public readonly filtroTexto = signal('');

	private readonly campusPorFilial: Record<string, string> = {
		'1': 'Lima Norte',
		'2': 'Trujillo',
		'3': 'Chiclayo',
		'4': 'Piura',
		'5': 'Tarapoto',
	};

	public readonly opcionesCampus = computed<string[]>(() => {
		const values = new Set(this.denuncias().map((item) => this.obtenerCampus(item.filial)));
		return ['Todos', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
	});

	public readonly denunciasFiltradas = computed<Denuncia[]>(() => {
		const estado = this.filtroEstado();
		const prioridad = this.filtroPrioridad();
		const campus = this.filtroCampus();
		const texto = this.filtroTexto().trim().toLowerCase();

		return this.denuncias().filter((item) => {
			const cumpleEstado = estado === 'Todos' || item.estado === estado;
			const cumplePrioridad = prioridad === 'Todos' || item.prioridad === prioridad;
			const cumpleCampus = campus === 'Todos' || this.obtenerCampus(item.filial) === campus;
			const nombreCompleto = `${item.nombre} ${item.apellidos}`.toLowerCase();
			const cumpleTexto =
				texto === '' ||
				item.expediente.toLowerCase().includes(texto) ||
				nombreCompleto.includes(texto) ||
				item.documento.toLowerCase().includes(texto) ||
				item.email.toLowerCase().includes(texto);

			return cumpleEstado && cumplePrioridad && cumpleCampus && cumpleTexto;
		});
	});

	public readonly resumen = computed(() => {
		const data = this.denunciasFiltradas();
		return {
			total: data.length,
			pendientes: data.filter((x) => x.estado === 'Pendiente').length,
			enProceso: data.filter((x) => x.estado === 'En Proceso').length,
			resueltos: data.filter((x) => x.estado === 'Resuelto').length,
		};
	});

	public readonly reportePorCampus = computed<ReporteCampus[]>(() => {
		const base = this.denunciasFiltradas().reduce((acc, item) => {
			const campus = this.obtenerCampus(item.filial);
			if (!acc[campus]) {
				acc[campus] = {campus, total: 0, pendientes: 0, enProceso: 0, resueltos: 0};
			}
			acc[campus].total += 1;
			if (item.estado === 'Pendiente') acc[campus].pendientes += 1;
			if (item.estado === 'En Proceso') acc[campus].enProceso += 1;
			if (item.estado === 'Resuelto') acc[campus].resueltos += 1;
			return acc;
		}, {} as Record<string, ReporteCampus>);

		return Object.values(base).sort((a, b) => b.total - a.total);
	});

	constructor() {
		this.cargar();
	}

	public limpiarFiltros(): void {
		this.filtroEstado.set('Todos');
		this.filtroPrioridad.set('Todos');
		this.filtroCampus.set('Todos');
		this.filtroTexto.set('');
	}

	public exportarCsv(): void {
		const registros = this.denunciasFiltradas();
		const headers = ['Expediente', 'Fecha', 'Campus', 'Estado', 'Prioridad', 'Persona', 'Documento', 'Correo'];

		const rows = registros.map((item) => [
			item.expediente,
			new Date(item.fecha).toISOString(),
			this.obtenerCampus(item.filial),
			item.estado,
			item.prioridad,
			`${item.nombre} ${item.apellidos}`,
			item.documento,
			item.email,
		]);

		const csv = [headers, ...rows]
			.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
			.join('\n');

		const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'reporte-denuncias.csv';
		anchor.click();
		URL.revokeObjectURL(url);
	}

	public obtenerCampusLabel(filial: string | number | null): string {
		return this.obtenerCampus(filial);
	}

	private cargar(): void {
		this.cargando.set(true);
		this.errorCarga.set(null);

		this.mainService.getDenuncias().subscribe({
			next: (data) => {
				this.denuncias.set(data);
			},
			error: () => {
				this.denuncias.set([]);
				this.errorCarga.set('No se pudo cargar los reportes desde la data mock.');
				this.cargando.set(false);
			},
			complete: () => {
				this.cargando.set(false);
			},
		});
	}

	private obtenerCampus(filial: string | number | null): string {
		if (filial === null || filial === '') {
			return 'Sin campus';
		}
		return this.campusPorFilial[String(filial)] ?? `Filial ${filial}`;
	}
}
