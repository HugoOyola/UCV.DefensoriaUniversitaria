import { MenuSidebar, MenuSidebarFooter } from '@shared/components/sidebar/menuSidebar';
export const Sidebar: MenuSidebar[] = [
	{
		id: 'inicio',
		name: 'Inicio',
		icon: 'home',
		path: '/inicio',
		action: (): void => {
			console.log('Inicio');
		},
	},
	{
		id: 'monitoreo-denuncias-reclamos',
		name: 'Gestión Denuncias / Reclamos',
		icon: 'clipboard-list',
		path: '/modulo',
		action: (): void => {
			console.log('Gestión Denuncias / Reclamos');
		},
		childrem: [
			{
				name: 'Todas',
				path: '/modulo',
				action: (): void => {
					console.log('Todas');
				},
			},
			{
				name: 'Por Revisar',
				path: '/modulo',
				action: (): void => {
					console.log('Por Revisar');
				},
			},
			{
				name: 'En Proceso',
				path: '/modulo',
				action: (): void => {
					console.log('En Proceso');
				},
			},
			{
				name: 'Resueltas',
				path: '/modulo',
				action: (): void => {
					console.log('Resueltas');
				},
			},
		],
	},
	{
		id: 'estadisticas',
		name: 'Estadisticas',
		icon: 'chart-bar',
		path: '/uikit',
		action: (): void => {
			console.log('Estadisticas');
		},
	},
	{
		id: 'reportes-1',
		name: 'Reportes',
		icon: 'report-analytics',
		action: (): void => {
			console.log('Reportes');
		},
	},
	{
		id: 'gestion-usuario',
		name: 'Gestión de Usuarios',
		icon: 'users',
		action: (): void => {
			console.log('Gestión de Usuarios');
		},
	},
	{
		id: 'reportes-2',
		name: 'Reportes',
		icon: 'file-description',
		action: (): void => {
			console.log('Reportes');
		},
	},
	{
		id: 'configuracion',
		name: 'Configuración',
		icon: 'settings',
		action: (): void => {
			console.log('Configuración');
		},
	},
];
export const SidebarFooter: MenuSidebarFooter[] = [
	// {
	// 	name: 'Dashboard',
	// 	icon: 'home',
	// 	path: '/uikit',
	// 	action: (): void => {
	// 		console.log('Dashboard');
	// 	},
	// },
	// {
	// 	name: 'Matricula',
	// 	icon: 'toggle-right',
	// 	action: (): void => {
	// 		console.log('Dashboard');
	// 	},
	// },
];
