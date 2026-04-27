import { HttpInterceptorFn } from '@angular/common/http';
import { SpinnerService } from './spinner.service';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { environment } from '@environment/environment';
import { catchError, finalize, switchMap, throwError, timer } from 'rxjs';

const tokenUrls = Object.values(environment.ls_apis).map((api) => api.token.tokenUrl);
const listUrl = [environment.ip, ...tokenUrls];

let requestCount = 0;

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
	const _spinnerService = inject(SpinnerService);
	const _authService = inject(AuthService);
	//* Cofiguraciones
	const MAXIMO_INTENTOS = environment.configInterceptor.MAXIMO_INTENTOS;
	const TIEMPO_ESPERA_MS = environment.configInterceptor.TIEMPO_ESPERA_MS;
	console.log('🔗 interceptor =>', request.url);
	// % Spinner Loading
	const shouldShowSpinner = request.params.has('showSpinner') ? request.params.get('showSpinner') === 'true' : true;
	if (listUrl.includes(request.url)) {
		return next(request).pipe(
			catchError((err) => {
				return throwError(() => err);
			})
		);
	} else {
		if (shouldShowSpinner) {
			requestCount++;
			_spinnerService.llamarSpinner();
		}
		const _apis = obtenerDominio(request.url);
		if (_apis && environment.local == false) {
			request = request.clone({
				setHeaders: {
					authorization: `Bearer ${localStorage.getItem(`token_${_apis.name}`)}`,
				},
			});
			let intentos = 0;
			return next(request).pipe(
				catchError((error, caught) => {
					// console.warn('intentos =>', intentos);
					// console.warn('MAXIMO_INTENTOS =>', MAXIMO_INTENTOS);
					// console.warn('error.status =>', error.status);
					if (error.status !== 500 && error.status !== 401 && error.status !== 503) {
						// console.warn('1 =>', 1);
						return throwError(() => error);
					}
					if (error.status === 500 || error.status === 503) {
						// console.warn('2 =>', 2);
						if (intentos >= MAXIMO_INTENTOS) {
							return throwError(() => error);
						}
						intentos++;
						// Usamos caught para mantener la cadena de reintentos
						return timer(TIEMPO_ESPERA_MS).pipe(switchMap(() => caught));
					}
					if (error.status === 401) {
						intentos = 0; // Reiniciamos intentos en caso de error 401
						// console.warn('3 =>', 3);
						if (_apis.user === '' && _apis.pass === '') {
							return _authService.getTokenRefreshToken().pipe(
								switchMap((data) => {
									_authService.setItemTokenRefreshToken(data.access_token, data.refresh_token);
									request = request.clone({
										setHeaders: {
											authorization: `Bearer ${localStorage.getItem(`token_${_apis.name}`)}`,
										},
									});
									return next(request).pipe(
										catchError((error) => {
											// Si falla con 500 o 503, aplicamos la lógica de reintentos
											if (error.status === 500 || error.status === 503) {
												return timer(TIEMPO_ESPERA_MS).pipe(switchMap(() => caught));
											}
											return throwError(() => error);
										})
									);
								}),
								catchError((err) => {
									return throwError(() => err);
								})
							);
						} else {
							return _authService.getToken(_apis.tokenUrl, _apis.user, _apis.pass).pipe(
								switchMap((data) => {
									_authService.setItem(_apis.name, data.expires_in, data.access_token);
									request = request.clone({
										setHeaders: {
											authorization: `Bearer ${localStorage.getItem(`token_${_apis.name}`)}`,
										},
									});
									return next(request).pipe(
										catchError((error) => {
											// Si falla con 500 o 503, aplicamos la lógica de reintentos
											if (error.status === 500 || error.status === 503) {
												return timer(TIEMPO_ESPERA_MS).pipe(switchMap(() => caught));
											}
											return throwError(() => error);
										})
									);
								}),
								catchError((err) => {
									return throwError(() => err);
								})
							);
						}
					}
					// console.warn('4 =>', 4);
					// intentos++;
					return throwError(() => error);
				}),
				finalize(() => {
					if (shouldShowSpinner) {
						requestCount--;
						if (requestCount <= 0) {
							_spinnerService.DetenerSpinner();
						}
					}
				})
			);
		} else {
			request = request.clone({
				setHeaders: {
					// authorization: 'Bearer ' + localStorage.getItem('token_api'),
				},
			});
			let valu = 0;
			return next(request).pipe(
				catchError((error, caught) => {
					if ((error.status !== 500 && error.status !== 401 && error.status !== 503) || valu == MAXIMO_INTENTOS) {
						return throwError(() => error);
					}
					valu++;
					return timer(TIEMPO_ESPERA_MS).pipe(switchMap(() => caught));
				}),
				finalize(() => {
					if (shouldShowSpinner) {
						requestCount--;
						if (requestCount <= 0) {
							_spinnerService.DetenerSpinner();
						}
					}
				})
			);
		}
	}
};
function obtenerDominio(url: string): {
	name: string;
	user: string;
	pass: string;
	tokenUrl: string;
} | null {
	let data;
	const regex = /^https?:\/\/[^/]+\/([^/]+)/;
	const match = regex.exec(url);
	const urlGlobal = match ? match[1] : '';
	if (environment.local) {
		return {
			name: '',
			user: '',
			pass: '',
			tokenUrl: '',
		};
	} else {
		for (const api of Object.values(environment.ls_apis)) {
			const routeKeys = Object.keys(api.routes);
			for (const routeKey of routeKeys) {
				if (urlGlobal === routeKey) {
					data = api.token;
					return data;
				}
			}
		}
	}
	return null;
}
