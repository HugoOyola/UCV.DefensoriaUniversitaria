import { Injectable, signal } from '@angular/core';

export interface PermisoDefinicion {
	id: string;
	nombre: string;
	descripcion: string;
	categoria: 'Casos' | 'Reportes' | 'Administracion';
}

export interface PerfilPermiso {
	id: string;
	nombre: string;
	descripcion: string;
	permisos: string[];
}

export interface UsuarioPermiso {
	codigo: string;
	nombre: string;
	cargo: string;
	foto: string;
	permisos: string[];
}

export interface ConfiguracionAcceso {
	requiereMfa: boolean;
	notificarCambiosPermisos: boolean;
	tiempoSesionMinutos: number;
	perfilPorDefecto: string;
}

@Injectable({
	providedIn: 'root',
})
export class UsuariosPermisosService {
	private readonly _catalogoPermisos = signal<PermisoDefinicion[]>([
		{
			id: 'casos.ver',
			nombre: 'Ver casos',
			descripcion: 'Permite visualizar denuncias y reclamos.',
			categoria: 'Casos',
		},
		{
			id: 'casos.gestionar',
			nombre: 'Gestionar casos',
			descripcion: 'Permite atender, responder y derivar casos.',
			categoria: 'Casos',
		},
		{
			id: 'estadisticas.ver',
			nombre: 'Ver estadisticas',
			descripcion: 'Permite visualizar tableros estadisticos.',
			categoria: 'Reportes',
		},
		{
			id: 'reportes.exportar',
			nombre: 'Exportar reportes',
			descripcion: 'Permite exportar reportes en CSV.',
			categoria: 'Reportes',
		},
		{
			id: 'usuarios.gestionar',
			nombre: 'Gestionar usuarios',
			descripcion: 'Permite buscar usuarios y asignar permisos.',
			categoria: 'Administracion',
		},
		{
			id: 'configuracion.gestionar',
			nombre: 'Gestionar configuracion',
			descripcion: 'Permite editar reglas globales del modulo.',
			categoria: 'Administracion',
		},
	]);

	private readonly _perfiles = signal<PerfilPermiso[]>([
		{
			id: 'analista',
			nombre: 'Analista DU',
			descripcion: 'Atiende casos y consulta reportes operativos.',
			permisos: ['casos.ver', 'casos.gestionar', 'estadisticas.ver'],
		},
		{
			id: 'coordinador',
			nombre: 'Coordinador DU',
			descripcion: 'Gestion integral de casos y reportes.',
			permisos: ['casos.ver', 'casos.gestionar', 'estadisticas.ver', 'reportes.exportar'],
		},
		{
			id: 'admin',
			nombre: 'Administrador',
			descripcion: 'Control total del modulo y permisos.',
			permisos: [
				'casos.ver',
				'casos.gestionar',
				'estadisticas.ver',
				'reportes.exportar',
				'usuarios.gestionar',
				'configuracion.gestionar',
			],
		},
	]);

	private readonly _usuarios = signal<UsuarioPermiso[]>([
		{
			codigo: 'DU0001',
			nombre: 'Mariela Paredes Rojas',
			cargo: 'Analista de Atencion',
			foto: '/assets/img/user.jpg',
			permisos: ['casos.ver', 'casos.gestionar', 'estadisticas.ver'],
		},
		{
			codigo: 'DU0002',
			nombre: 'Carlos Ureta Lozano',
			cargo: 'Coordinador de Defensoria',
			foto: '/assets/img/user.jpg',
			permisos: ['casos.ver', 'casos.gestionar', 'estadisticas.ver', 'reportes.exportar'],
		},
		{
			codigo: 'DU0003',
			nombre: 'Yessica Lujan Flores',
			cargo: 'Asistente Administrativo',
			foto: '/assets/img/user.jpg',
			permisos: ['casos.ver'],
		},
		{
			codigo: 'DU0004',
			nombre: 'Jose Caballero Mejia',
			cargo: 'Administrador del Sistema',
			foto: '/assets/img/user.jpg',
			permisos: [
				'casos.ver',
				'casos.gestionar',
				'estadisticas.ver',
				'reportes.exportar',
				'usuarios.gestionar',
				'configuracion.gestionar',
			],
		},
	]);

	private readonly _configuracion = signal<ConfiguracionAcceso>({
		requiereMfa: true,
		notificarCambiosPermisos: true,
		tiempoSesionMinutos: 45,
		perfilPorDefecto: 'analista',
	});

	private readonly _usuarioActivoCodigo = signal<string | null>(null);

	public readonly usuarios = this._usuarios.asReadonly();
	public readonly catalogoPermisos = this._catalogoPermisos.asReadonly();
	public readonly perfiles = this._perfiles.asReadonly();
	public readonly configuracion = this._configuracion.asReadonly();
	public readonly usuarioActivoCodigo = this._usuarioActivoCodigo.asReadonly();

	buscarUsuarios(termino: string): UsuarioPermiso[] {
		const query = termino.trim().toLowerCase();
		if (query === '') {
			return this._usuarios();
		}

		return this._usuarios().filter((usuario) => {
			const byNombre = usuario.nombre.toLowerCase().includes(query);
			const byCodigo = usuario.codigo.toLowerCase().includes(query);
			return byNombre || byCodigo;
		});
	}

	seleccionarUsuario(codigo: string): void {
		this._usuarioActivoCodigo.set(codigo === '' ? null : codigo);
	}

	obtenerUsuario(codigo: string | null): UsuarioPermiso | null {
		if (!codigo) return null;
		return this._usuarios().find((usuario) => usuario.codigo === codigo) ?? null;
	}

	togglePermisoUsuario(codigo: string, permisoId: string): void {
		this._usuarios.update((usuarios) =>
			usuarios.map((usuario) => {
				if (usuario.codigo !== codigo) return usuario;

				const existe = usuario.permisos.includes(permisoId);
				const permisosActualizados = existe
					? usuario.permisos.filter((permiso) => permiso !== permisoId)
					: [...usuario.permisos, permisoId];

				return {
					...usuario,
					permisos: permisosActualizados,
				};
			})
		);
	}

	aplicarPerfil(codigo: string, perfilId: string): void {
		const perfil = this._perfiles().find((item) => item.id === perfilId);
		if (!perfil) return;

		this._usuarios.update((usuarios) =>
			usuarios.map((usuario) => {
				if (usuario.codigo !== codigo) return usuario;
				return {
					...usuario,
					permisos: [...perfil.permisos],
				};
			})
		);
	}

	actualizarConfiguracion(parcial: Partial<ConfiguracionAcceso>): void {
		this._configuracion.update((actual) => ({
			...actual,
			...parcial,
		}));
	}
}
