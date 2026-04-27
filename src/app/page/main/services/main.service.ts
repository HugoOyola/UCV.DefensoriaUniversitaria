import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { ResponseResultLst } from '@interface/responseResult.interface';
import { GlobalService } from '@shared/services/global.service';
import { Observable, map } from 'rxjs';
import { ObtenerDatosPersonales } from '../interface/principal';
import { ExpedienteDU, ListarExpedientesDUParam } from '../interface/denuncias.interface';

@Injectable({
	providedIn: 'root',
})
export class MainService extends GlobalService {
	private TrilcePrincipal = environment.ls_apis.trilceapi2.routes.TrilcePrincipalApi;
	private ejemplo = environment.ls_apis.authjwt.routes.ejemplo;
	private DefensoriaUni = environment.ls_apis.authjwt.routes.defensoriaUniversitaria;
	private DefensoriaUniversitaria = environment.ls_apis.trilceapi2.routes.DefensoriaUniversitariaApi;

	constructor() {
		super();
	}

	post_Principal_ObtenerDatosPersonalesejemplo(cPerCodigo: string): Observable<HttpResponse<ResponseResultLst<ObtenerDatosPersonales>>> {
		const param = { cPerCodigo };
		const ling = this.ejemplo.url + this.ejemplo.endpoints.Principal_ObtenerDatosPersonales;
		return this._http.post<ResponseResultLst<ObtenerDatosPersonales>>(ling, param, {
			headers: this.headers_a_json,
			observe: 'response',
		});
	}
	post_Principal_ObtenerDatosPersonales(cPerCodigo: string): Observable<HttpResponse<ResponseResultLst<ObtenerDatosPersonales>>> {
		const param = { cPerCodigo };
		const ling = this.TrilcePrincipal.url + this.TrilcePrincipal.endpoints.Principal_ObtenerDatosPersonales;
		return this._http.post<ResponseResultLst<ObtenerDatosPersonales>>(ling, param, {
			headers: this.headers_a_json,
			observe: 'response',
		});
	}

	post_Expedientes_ListarExpedientesDU(param: ListarExpedientesDUParam): Observable<HttpResponse<ResponseResultLst<ExpedienteDU>>> {
		const ling = this.DefensoriaUni.url + this.DefensoriaUniversitaria.endpoints.Expedientes_ListarExpedientesDU;
		return this._http.post<ResponseResultLst<ExpedienteDU>>(ling, param, {
			headers: this.headers_a_json,
			observe: 'response',
		});
	}
}
