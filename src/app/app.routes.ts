import {Routes} from '@angular/router';
import {ModulosComponent} from './page/module/modulos.component';
import {MainComponent} from './page/main/main.component';
import {InicioComponent} from './page/main/components/inicio/inicio.component';
import {GestionComponent} from './page/main/components/gestion/gestion.component';

export const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		// loadComponent: () => import('./page/main/main.component').then((m) => m.MainComponent),
		title: 'Modulo Datos - Principal',
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'inicio',
			},
			{
				path: 'inicio',
				component: InicioComponent,
				title: 'Dashboard Defensoría Universitaria',
			},
			{
				path: 'gestion',
				component: GestionComponent,
				title: 'Gestion de Casos - Principal',
			},
			{
				path: 'estadisticas',
				loadComponent: () =>
					import('./page/main/components/estadisticas/estadisticas.component').then((m) => m.EstadisticasComponent),
				title: 'Estadisticas de Denuncias',
			},
			{
				path: 'reportes',
				loadComponent: () => import('./page/main/components/reportes/reportes.component').then((m) => m.ReportesComponent),
				title: 'Reportes de Denuncias',
			},
			{
				path: 'gestion-usuarios',
				loadComponent: () =>
					import('./page/main/components/gestion-usuarios/gestion-usuarios.component').then((m) => m.GestionUsuariosComponent),
				title: 'Gestion de Usuarios',
			},
			{
				path: 'configuracion',
				loadComponent: () =>
					import('./page/main/components/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
				title: 'Configuracion',
			},
			// {
			// 	path: 'modulo',
			// 	component: DatosBasicosComponent,
			// 	loadComponent: () => import('./page/main/main.component').then((m) => m.MainComponent),
			// 	title: 'Modulo Datos - Principal',
			// },
			{
				path: 'uikit',
				loadComponent: () => import('./page/ui-kit/ui-kit.component').then((m) => m.UiKitComponent),
				title: 'Modulo Datos - Principal',
			},
			{
				path: '**',
				loadComponent: () => import('./core/shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
				title: '404',
			},
		],
	},
	{
		path: 'modulo',
		component: ModulosComponent,
		// loadComponent: () => import('./page/main/main.component').then((m) => m.MainComponent),

		title: 'Modulo Datos - Principal',
	},
	{
		path: 'uikit',
		loadComponent: () => import('./page/ui-kit/ui-kit.component').then((m) => m.UiKitComponent),

		title: 'Modulo Datos - Principal',
	},
	{
		path: '**',
		loadComponent: () => import('./core/shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
		title: '404',
	},
];
