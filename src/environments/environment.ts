import { routes } from './endpoints';
export const environment = {
	production: true,
	local: false,
	configInterceptor: {
		MAXIMO_INTENTOS: 10,
		TIEMPO_ESPERA_MS: 3000,
	},

	// *Api Ip
	ip: 'https://api.ipify.org/?format=json',

	// *Api redireccio
	redireccion: 'https://trilce.ucv.edu.pe/default.aspx',
	apiRefreshToken: 'https://jwttrilce.azurewebsites.net/api/RefreshToken',
	// *Apis
	ls_apis: {
		authjwt: {
			token: {
				name: 'authjwt',
				user: '',
				pass: '',
				tokenUrl: 'https://trilceapi2.ucv.edu.pe:8243/token?grant_type=client_credentials',
			},
			routes: {
				ejemplo: {
					url: 'https://trilceapi2.ucv.edu.pe:8243/ejemplo/pr/api/',
					...routes.ejemplo,
				},
				defensoriaUniversitaria: {
					url: 'https://ucvapi.azure-api.net/defensoriaUniversitaria/v2/api/',
					...routes.defensoriaUniversitaria,
				},
			},
		},
		trilceapi2: {
			token: {
				name: 'trilceapi2',
				user: 'og5xgX458yx8pDVB5UpWgNabxL8a',
				pass: '7RluNM9ox3T1UR7xOv0EONCo4Nka',
				tokenUrl: 'https://trilceapi2.ucv.edu.pe:8243/token?grant_type=client_credentials',
			},
			routes: {
				TrilcePrincipalApi: {
					...routes.TrilcePrincipalApi,
					// ...routes.IncidenciaApi
				},
				IncidenciaApi: {
					...routes.IncidenciaApi
				},
				DefensoriaUniversitariaApi: {
					...routes.DefensoriaUniversitariaApi,
				},
			},
		},
	},
	ls_apis1: {
		trilceapi2: {
			token: {
				name: 'trilceapi2',
				user: 'og5xgX458yx8pDVB5UpWgNabxL8a',
				pass: '7RluNM9ox3T1UR7xOv0EONCo4Nka',
				tokenUrl: 'https://trilceapi2.ucv.edu.pe:8243/token?grant_type=client_credentials',
			},
			routes: {
				IncidenciaApi: {
					...routes.IncidenciaApi
				},
			},
		},
	},
	endpointGoogleDrive: 'https://ucvapiqa.azure-api.net/gdriveqa/Drive',
	apiKeyUser: 'yLPHaYGzLE5c2LhtSbeL0r1oWocC',
	apiKeyPass: '4dKtykbacYR1u59jRXi9fX03341i',
	apiTokenUrl: 'https://ucvapi.azure-api.net/jwttrilce/v1/api/Token/Login',
	cDominio: 'trilce.qa.ucv.edu.pe',
};
