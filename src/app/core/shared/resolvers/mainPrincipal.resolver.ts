import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {MainSharedService} from '../services/main-shared.service';
import {PerfilesSharedService} from '../services/perfiles-shared.service';
import {payloadJWT} from '../utils/payloadJWT';
import { defaultIfEmpty, fromEvent, map, Observable, of, race, switchMap, take, tap, timer } from 'rxjs';
import { AuthService } from '@app/core/auth/auth.service'; 
import { environment } from '@environment/environment';
export interface TrilceIframeData {
	isAuthenticated: boolean;
	timedOut: boolean;
} 

export const mainPrincipalResolver: ResolveFn<TrilceIframeData> = () => {
	const mainSharedService = inject(MainSharedService);
	const authService = inject(AuthService);
	// const _perfilesSharedService = inject(PerfilesSharedService);
window.parent.postMessage({type: 'TrilceUcvIframe'}, '*');


	// Observable para escuchar mensajes del padre
	const messageEvent$ = fromEvent<MessageEvent>(window, 'message').pipe(
		take(1),
		switchMap((event) => {
			if (event.data.type === 'TrilceUCV') {
				console.log('😎 Resolver: Recibido evento TrilceUCV');
				console.log('😎 Resolver: event	', event.data);
				return processAuthenticationData(event, authService,  mainSharedService );
			}
			return of({isAuthenticated: false, timedOut: false});
		})
	);
// Observable de timeout (3 segundos)
	const timeout$ = timer(3000).pipe(
		tap(() => {
			console.log('⏰ Resolver: Timeout - redireccionando al padre');
			window.parent.location.href = environment.redireccion;
		}),
		map(() => ({isAuthenticated: false, timedOut: true}))
	);

	// Competir entre el mensaje del padre y el timeout
	return race(messageEvent$, timeout$);
};

	function processAuthenticationData(
		event: MessageEvent,
		authService: AuthService, 
		mainSharedService: MainSharedService, 
	): Observable<TrilceIframeData> {
		return authService.ReloadToken().pipe(
			// ReloadToken usa forkJoin que puede completar sin emitir si los observables internos no emiten
			// defaultIfEmpty asegura que siempre haya un valor para que map se ejecute
			defaultIfEmpty(null),
			map(() => {
				const data = event.data.data;
	
				// Decodificar y almacenar datos del usuario 
				mainSharedService.accessToken.set(data.accessToken);
				mainSharedService.refreshToken.set(data.refreshToken);
	// _perfilesSharedService.actualizarPerfiles(event.data.user_Perfil);
				console.log('🟡 Resolver: Token procesado =>', mainSharedService.accessToken() !== '' ? 'OK' : 'VACÍO');
	
				// Almacenar token en localStorage si existe
				if (mainSharedService.accessToken() !== '') {
					localStorage.setItem('token_authjwt', mainSharedService.accessToken());
						const PAYPLOAD =payloadJWT(mainSharedService.accessToken())
					const fecha = new Date(PAYPLOAD.exp * 1000);
				mainSharedService.cPerCodigo.set(PAYPLOAD.cPerCodigo);
					localStorage.setItem('expires_authjwt', fecha.toString());
				}
	
				return {isAuthenticated: true, timedOut: false};
			})
		);
	}

 