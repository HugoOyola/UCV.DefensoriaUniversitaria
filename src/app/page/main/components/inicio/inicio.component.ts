import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';

type EstadoReclamo = 'Pendiente' | 'Resuelto' | 'Investigación';

interface OpcionCampus {
	label: string;
	value: string;
}

interface TarjetaResumen {
	titulo: string;
	valor: string;
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

interface ReclamoReciente {
	id: string;
	fechaEnvio: string;
	campus: string;
	estado: EstadoReclamo;
}

interface MetricaInferior {
	titulo: string;
	valor: string;
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
		SelectModule
	],
	templateUrl: './inicio.component.html',
	styleUrl: './inicio.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioComponent {
	public readonly opcionesCampus = signal<OpcionCampus[]>([
		{ label: 'Todos los campus (12)', value: 'all' },
		{ label: 'Lima Central', value: 'Lima Central' },
		{ label: 'Trujillo', value: 'Trujillo' },
		{ label: 'Chiclayo', value: 'Chiclayo' },
		{ label: 'Piura', value: 'Piura' }
	]);

	public readonly campusControl = new FormControl<OpcionCampus>(
		{ label: 'Todos los campus (12)', value: 'all' },
		{ nonNullable: true }
	);

	private readonly campusSeleccionado = toSignal(
		this.campusControl.valueChanges.pipe(startWith(this.campusControl.value)),
		{ initialValue: this.campusControl.value }
	);

	public readonly tarjetasResumen = signal<TarjetaResumen[]>([
		{
			titulo: 'Total de reclamos',
			valor: '1,482',
			insignia: { texto: '↗ 12%', tono: 'success' },
			icono: 'pi pi-file'
		},
		{
			titulo: 'Pendientes de resolución',
			valor: '234',
			insignia: { texto: '5 urgentes', tono: 'danger' },
			icono: 'pi pi-clock'
		},
		{
			titulo: 'Casos resueltos',
			valor: '1,248',
			insignia: { texto: '84% tasa', tono: 'success' },
			icono: 'pi pi-check-circle'
		},
		{
			titulo: 'Tiempo promedio de resolución',
			valor: '4.2',
			sufijo: 'días',
			icono: 'pi pi-info-circle'
		}
	]);

	public readonly distribucionUsuarios = signal<DistribucionUsuario[]>([
		{ etiqueta: 'Estudiantes', porcentaje: 65, cantidad: 964 },
		{ etiqueta: 'Docentes', porcentaje: 18, cantidad: 266 },
		{ etiqueta: 'Personal administrativo', porcentaje: 12, cantidad: 178 },
		{ etiqueta: 'Egresados', porcentaje: 5, cantidad: 74 }
	]);

	public readonly reclamosRecientes = signal<ReclamoReciente[]>([
		{
			id: '#DU-2024-0892',
			fechaEnvio: '2023-10-24',
			campus: 'Lima Central',
			estado: 'Pendiente'
		},
		{
			id: '#DU-2024-0891',
			fechaEnvio: '2023-10-23',
			campus: 'Trujillo',
			estado: 'Resuelto'
		},
		{
			id: '#DU-2024-0890',
			fechaEnvio: '2023-10-23',
			campus: 'Chiclayo',
			estado: 'Investigación'
		},
		{
			id: '#DU-2024-0889',
			fechaEnvio: '2023-10-22',
			campus: 'Piura',
			estado: 'Resuelto'
		}
	]);

	public readonly reclamosFiltrados = computed(() => {
		const campus = this.campusSeleccionado()?.value ?? 'all';

		if (campus === 'all') {
			return this.reclamosRecientes();
		}

		return this.reclamosRecientes().filter((reclamo) => reclamo.campus === campus);
	});

	public readonly metricasInferiores = signal<MetricaInferior[]>([
		{
			titulo: 'Satisfacción del cliente',
			valor: '92.4%',
			subtitulo: '+2.1% vs año anterior',
			progreso: 92.4,
			icono: 'pi pi-face-smile'
		},
		{
			titulo: 'Tasa de resolución',
			valor: '84.2%',
			subtitulo: 'Meta: 85%',
			progreso: 84.2,
			icono: 'pi pi-check-circle'
		},
		{
			titulo: 'Tasa de reclamos pendientes',
			valor: '15.8%',
			subtitulo: '-0.4% mejora',
			progreso: 15.8,
			icono: 'pi pi-exclamation-triangle'
		}
	]);

	obtenerSeveridadEstado(
		estado: EstadoReclamo
	): 'success' | 'danger' | 'info' | 'secondary' {
		switch (estado) {
			case 'Resuelto':
				return 'success';
			case 'Pendiente':
				return 'danger';
			case 'Investigación':
				return 'info';
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
}