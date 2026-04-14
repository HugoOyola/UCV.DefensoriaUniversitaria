import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {PerfilPermiso, UsuariosPermisosService} from '../../services/usuarios-permisos.service';

@Component({
	selector: 'app-configuracion',
	imports: [FormsModule],
	templateUrl: './configuracion.component.html',
	styleUrl: './configuracion.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
	private readonly permisosService = inject(UsuariosPermisosService);
	private readonly router = inject(Router);

	public readonly perfiles = this.permisosService.perfiles;
	public readonly configuracion = this.permisosService.configuracion;

	public readonly usuarioActivo = computed(() =>
		this.permisosService.obtenerUsuario(this.permisosService.usuarioActivoCodigo())
	);

	public readonly draftPerfil = signal(this.configuracion().perfilPorDefecto);
	public readonly draftSesion = signal(this.configuracion().tiempoSesionMinutos);
	public readonly draftMfa = signal(this.configuracion().requiereMfa);
	public readonly draftNotificacion = signal(this.configuracion().notificarCambiosPermisos);

	public readonly totalPermisos = computed(() => this.permisosService.catalogoPermisos().length);

	guardarConfiguracion(): void {
		this.permisosService.actualizarConfiguracion({
			perfilPorDefecto: this.draftPerfil(),
			tiempoSesionMinutos: this.draftSesion(),
			requiereMfa: this.draftMfa(),
			notificarCambiosPermisos: this.draftNotificacion(),
		});
	}

	aplicarPerfil(perfil: PerfilPermiso): void {
		const usuario = this.usuarioActivo();
		if (!usuario) return;
		this.permisosService.aplicarPerfil(usuario.codigo, perfil.id);
	}

	irAGestionUsuarios(): void {
		void this.router.navigate(['/gestion-usuarios']);
	}
}
