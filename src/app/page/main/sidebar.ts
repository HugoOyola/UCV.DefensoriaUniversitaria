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
		path: '/gestion',
		action: (): void => {
			console.log('Gestión Denuncias / Reclamos');
		}
	},
	{
		id: 'estadisticas',
		name: 'Estadisticas',
		icon: 'chart-bar',
		path: '/estadisticas',
		action: (): void => {
			console.log('Estadisticas');
		},
	},
	{
		id: 'reportes-1',
		name: 'Reportes',
		icon: 'report-analytics',
		path: '/reportes',
		action: (): void => {
			console.log('Reportes');
		},
	},
	{
		id: 'gestion-usuario',
		name: 'Gestión de Usuarios',
		icon: 'users',
		path: '/gestion-usuarios',
		action: (): void => {
			console.log('Gestión de Usuarios');
		},
	},
	{
		id: 'configuracion',
		name: 'Configuración',
		icon: 'settings',
		path: '/configuracion',
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
