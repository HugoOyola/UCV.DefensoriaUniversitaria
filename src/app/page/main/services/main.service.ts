import {HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@environment/environment';
import {ResponseResultLst} from '@interface/responseResult.interface';
import {GlobalService} from '@shared/services/global.service';
import {Observable, delay, map, of} from 'rxjs';
import {ObtenerDatosPersonales} from '../interface/principal';
import {Denuncia} from '../interface/denuncias.interface';
import {DENUNCIAS_MOCK} from './denuncias.mock';
@Injectable({
	providedIn: 'root',
})
export class MainService extends GlobalService {
	private TrilcePrincipal = environment.ls_apis.trilceapi2.routes.TrilcePrincipalApi;
	private Incidencia = environment.ls_apis1.trilceapi2.routes.IncidenciaApi;

	constructor() {
		super();
	}
	// params: {showSpinner: false},
	post_Principal_ObtenerDatosPersonales(cPerCodigo: string): Observable<HttpResponse<ResponseResultLst<ObtenerDatosPersonales>>> {
		const param = {cPerCodigo};
		const ling = this.TrilcePrincipal.url + this.TrilcePrincipal.endpoints.Principal_ObtenerDatosPersonales;
		return this._http.post<ResponseResultLst<ObtenerDatosPersonales>>(ling, param, {
			headers: this.headers_a_json,
			observe: 'response',
		});
	}

	post_Main_ObtenerDenuncias(): Observable<HttpResponse<ResponseResultLst<Denuncia>>> {
		const body: ResponseResultLst<Denuncia> = {
			lstItem: DENUNCIAS_MOCK,
			pagination: {
				pageIndex: 1,
				pageSize: DENUNCIAS_MOCK.length,
				totalRows: DENUNCIAS_MOCK.length,
			},
			isSuccess: true,
			lstError: [],
			ticket: 'mock-denuncias',
			clientName: 'local',
			userName: 'local',
			serverName: 'local',
			resultado: 1,
		};

		return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
	}

	// ─── Métodos para denuncias ──────────────────────────────────────────────────
	/**
	 * Obtiene la lista de denuncias
	 * Por ahora usa datos mock, pero mantiene la estructura Observable para
	 * facilitar la migración futura a una API
	 */
	getDenuncias(): Observable<Denuncia[]> {
		return this.post_Main_ObtenerDenuncias().pipe(
			map((response) => response.body?.lstItem ?? [])
		);
	}

	/**
	 * Obtiene una denuncia por su expediente
	 * @param expediente Código de expediente (ej: DEF-2025-001)
	 */
	getDenunciaByExpediente(expediente: string): Observable<Denuncia | undefined> {
		// TODO: Cuando esté lista la API, reemplazar esto con:
		// const url = this.TrilcePrincipal.url + this.TrilcePrincipal.endpoints.Denuncias_ObtenerPorExpediente;
		// return this._http.post<Denuncia>(url, { expediente }, { headers: this.headers_a_json });

		const denuncia = DENUNCIAS_MOCK.find(d => d.expediente === expediente);
		return of(denuncia);
	}
}
