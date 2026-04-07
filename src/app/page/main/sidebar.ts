import {MenuSidebar, MenuSidebarFooter} from '@shared/components/sidebar/menuSidebar';
export const Sidebar: MenuSidebar[] = [
	{
		name: 'Dashboard de la Dashboard con Dashboard Dashboard',
		icon: 'home',
		// path: '/uikit',
		action: (): void => {
			console.log('Dashboard');
		},
		childrem: [
			{
				name: 'Dashboard',
				path: '/uikit',

				action: (): void => {
					console.log('Dashboard');
				},
			},
			{
				name: 'Matricula',
				action: (): void => {
					console.log('Dashboard');
				},
				childrem: [
					{
						name: 'Dashboard',
						action: (): void => {
							console.log('Dashboard');
						},
					},
					{
						name: 'Datos Básicos',

						action: (): void => {
							console.log('Dashboard');
						},
					},
				],
			},
			{
				name: 'Matricula2',
				action: (): void => {
					console.log('Dashboard');
				},
				childrem: [
					{
						name: 'Dashboard',
						action: (): void => {
							console.log('Dashboard');
						},
					},
					{
						name: 'Datos Básicos',

						action: (): void => {
							console.log('Dashboard');
						},
					},
				],
			},
		],
	},
	{
		name: 'Matricula',
		icon: '360',
		path: '/',
		action: (): void => {
			console.log('Dashboard');
		},
		childrem: [
			{
				name: 'Dashboard',
				action: (): void => {
					console.log('Dashboard');
				},
			},
			{
				name: 'Matricula',
				action: (): void => {
					console.log('Dashboard');
				},
			},
		],
	},
	{
		name: 'Registro de Licencia',
		icon: '360',
		path : '/licencia',
		action: (): void => {
			console.log('licencia');
		},
	},
];
export const SidebarFooter: MenuSidebarFooter[] = [
	{
		name: 'Dashboard',
		icon: 'home',
		path: '/uikit',
		action: (): void => {
			console.log('Dashboard');
		},
	},
	{
		name: 'Matricula',
		icon: 'toggle-right',
		action: (): void => {
			console.log('Dashboard');
		},
	},
];
