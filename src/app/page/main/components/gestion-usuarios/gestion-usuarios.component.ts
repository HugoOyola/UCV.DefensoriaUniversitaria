import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {PermisoDefinicion, UsuarioPermiso, UsuariosPermisosService} from '../../services/usuarios-permisos.service';

@Component({
	selector: 'app-gestion-usuarios',
	imports: [FormsModule],
	templateUrl: './gestion-usuarios.component.html',
	styleUrl: './gestion-usuarios.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionUsuariosComponent {
	private readonly permisosService = inject(UsuariosPermisosService);
	private readonly router = inject(Router);

	public readonly terminoBusqueda = signal('');
	public readonly codigoSeleccionado = signal<string | null>(null);

	public readonly usuariosFiltrados = computed<UsuarioPermiso[]>(() =>
		this.permisosService.buscarUsuarios(this.terminoBusqueda())
	);

	public readonly usuarioSeleccionado = computed<UsuarioPermiso | null>(() => {
		const codigo = this.codigoSeleccionado();
		if (!codigo) return null;
		return this.permisosService.obtenerUsuario(codigo);
	});

	public readonly permisosAgrupados = computed(() => {
		const map = new Map<string, PermisoDefinicion[]>();
		for (const permiso of this.permisosService.catalogoPermisos()) {
			const current = map.get(permiso.categoria) ?? [];
			current.push(permiso);
			map.set(permiso.categoria, current);
		}
		return Array.from(map.entries()).map(([categoria, permisos]) => ({categoria, permisos}));
	});

	constructor() {
		effect(() => {
			const lista = this.usuariosFiltrados();
			const actual = this.codigoSeleccionado();

			if (lista.length === 0) {
				this.codigoSeleccionado.set(null);
				this.permisosService.seleccionarUsuario('');
				return;
			}

			const existe = !!actual && lista.some((usuario) => usuario.codigo === actual);
			if (!existe) {
				this.codigoSeleccionado.set(lista[0].codigo);
				this.permisosService.seleccionarUsuario(lista[0].codigo);
			}
		});
	}

	seleccionarUsuario(codigo: string): void {
		this.codigoSeleccionado.set(codigo);
		this.permisosService.seleccionarUsuario(codigo);
	}

	tienePermiso(permisoId: string): boolean {
		return this.usuarioSeleccionado()?.permisos.includes(permisoId) ?? false;
	}

	togglePermiso(permisoId: string): void {
		const usuario = this.usuarioSeleccionado();
		if (!usuario) return;
		this.permisosService.togglePermisoUsuario(usuario.codigo, permisoId);
	}

	irAConfiguracion(): void {
		void this.router.navigate(['/configuracion']);
	}
}
