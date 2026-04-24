import {HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@environment/environment';
import {ResponseResultLst} from '@interface/responseResult.interface';
import {GlobalService} from '@shared/services/global.service';
import {Observable, map} from 'rxjs';
import {ObtenerDatosPersonales} from '../interface/principal';
import {
	Adjunto,
	Denuncia,
	EstadoDenuncia,
	ExpedienteDU,
	ListarExpedientesDUParam,
	OtraAreaDenuncia,
	TipoUsuarioDenuncia,
} from '../interface/denuncias.interface';

@Injectable({
	providedIn: 'root',
})
export class MainService extends GlobalService {
	private TrilcePrincipal = environment.ls_apis.trilceapi2.routes.TrilcePrincipalApi;
	private DefensoriaUniversitaria = environment.ls_apis.trilceapi2.routes.DefensoriaUniversitariaApi;

	constructor() {
		super();
	}

	post_Principal_ObtenerDatosPersonales(cPerCodigo: string): Observable<HttpResponse<ResponseResultLst<ObtenerDatosPersonales>>> {
		const param = {cPerCodigo};
		const ling = this.TrilcePrincipal.url + this.TrilcePrincipal.endpoints.Principal_ObtenerDatosPersonales;
		return this._http.post<ResponseResultLst<ObtenerDatosPersonales>>(ling, param, {
			headers: this.headers_a_json,
			observe: 'response',
		});
	}

	post_Expedientes_ListarExpedientesDU(param: ListarExpedientesDUParam): Observable<HttpResponse<ResponseResultLst<ExpedienteDU>>> {
		const ling = this.DefensoriaUniversitaria.url + this.DefensoriaUniversitaria.endpoints.Expedientes_ListarExpedientesDU;
		return this._http.post<ResponseResultLst<ExpedienteDU>>(ling, param, {
			headers: this.headers_a_json,
			observe: 'response',
		});
	}

	post_Main_ObtenerDenuncias(
		idPerfil: number = 12,
		estadoExp: number = 0,
		prioridades: number = 0,
		fechaInicio?: Date | null,
		fechaFin?: Date | null
	): Observable<HttpResponse<ResponseResultLst<Denuncia>>> {
		const fechaInicioRequest = this.toStartOfDayIso(fechaInicio);
		const fechaFinRequest = this.toEndOfDayIso(fechaFin);
		const param: ListarExpedientesDUParam = {
			idPerfil,
			busqueda: '',
			fechaInicio: fechaInicioRequest,
			fechaFin: fechaFinRequest,
			estadoExp,
			prioridades,
		};
		return this.post_Expedientes_ListarExpedientesDU(param).pipe(
			map((response) => {
				const body = response.body;
				const mapped: ResponseResultLst<Denuncia> | null = body
					? {
							...body,
							lstItem: body.lstItem.map((exp) => this.mapExpedienteToDenuncia(exp)),
					  }
					: null;
				return response.clone({body: mapped});
			})
		);
	}

	getDenuncias(idPerfil: number = 12): Observable<Denuncia[]> {
		return this.post_Main_ObtenerDenuncias(idPerfil).pipe(
			map((response) => response.body?.lstItem ?? [])
		);
	}

	// ─── Mapper ───────────────────────────────────────────────────────────────────

	private mapExpedienteToDenuncia(exp: ExpedienteDU): Denuncia {
		return {
			expediente: exp.formatoExpediente,
			fecha: new Date(exp.fechaRegistro),
			tipoUsuario: String(exp.tipoUsuario) as TipoUsuarioDenuncia,
			estado: this.mapEstado(exp.expEstado),
			prioridad: null,
			asignado: null,
			filial: exp.cFilial,
			nombre: exp.nombreUsuario,
			apellidos: exp.apellidoUsuario,
			documento: exp.documento,
			escuelaProfesional: exp.cUniOrgNombre,
			modalidad: exp.tipoModalidad,
			domicilio: exp.direccion,
			telefono: exp.telefono,
			email: exp.correo,
			isApoderado: exp.tieneApoderado?.toLowerCase() === 'true',
			apoderadoApellidos: exp.apoApellidos ?? undefined,
			apoderadoNombres: exp.apoNombres ?? undefined,
			apoderadoEmail: exp.apoCorreo ?? undefined,
			otraArea: this.mapOtraArea(exp.opcionesTexto),
			otraAreaOtro: exp.textoOtros ?? undefined,
			expone: exp.descripcion,
			solicita: exp.solicita,
			adjuntos: exp.archivos?.map((archivo) => ({
				nombre: archivo.nombreArchivo,
				url: this.buildAdjuntoUrl(archivo.cGoogleDriveId),
				tipo: archivo.mimeType,
				tamanio: archivo.tamanoBytes,
			} as Adjunto)),
		};
	}

	private buildAdjuntoUrl(fileId: string | null | undefined): string | undefined {
		const id = (fileId ?? '').trim();
		if (!id) return undefined;
		return `https://ucvapi.azure-api.net/gdrive/Drive/ShowFile/${id}/2`;
	}

	private mapEstado(expEstado: number): EstadoDenuncia | null {
		switch (expEstado) {
			case 1: return 'Sin Atender';
			case 2: return 'Pendiente';
			case 3: return 'En Proceso';
			case 4: return 'Resuelto';
			default: return null;
		}
	}

	private mapOtraArea(opcionesTexto: string | null | undefined): OtraAreaDenuncia {
		const texto = (opcionesTexto ?? '').toLowerCase();
		return {
			libro: texto.includes('libro'),
			tribunal: texto.includes('tribunal'),
			comision: texto.includes('comision'),
			direccion: texto.includes('direccion'),
			secretaria: texto.includes('secretaria'),
			cap: texto.includes('cap'),
			otro: texto.includes('otro'),
		};
	}

	private toStartOfDayIso(value?: Date | null): string {
		if (!value || Number.isNaN(value.getTime())) {
			return '';
		}

		const start = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
		return start.toISOString();
	}

	private toEndOfDayIso(value?: Date | null): string {
		if (!value || Number.isNaN(value.getTime())) {
			return '';
		}

		const end = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999);
		return end.toISOString();
	}
}

