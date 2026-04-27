export const routes = {
	ejemplo: {
		endpoints: {
			Principal_ObtenerDatosPersonales: 'Principal/ObtenerDatosPersonales',
		},
	},
	defensoriaUniversitaria: {
		endpoints: {
			Expedientes_ListarExpedientesDU: 'Expedientes/ListarExpedientesDU',
		},
	},
	TrilcePrincipalApi: {
		url: 'https://ucvapi.azure-api.net/trilceprincipal/api/',
		endpoints: {
			//% Principal
			Principal_ObtenerDatosPersonales: 'Principal/ObtenerDatosPersonales',
		},
	},
	DefensoriaUniversitariaApi: {
		url: 'https://ucvapi.azure-api.net/defensoriaUniversitaria/v2/api/',
		endpoints: {
			//% Expedientes
			Expedientes_ListarExpedientesDU: 'Expedientes/ListarExpedientesDU',
		},
	},
	IncidenciaApi: {
		url: 'http://localhost:5019/api/',
		endpoints: {
			LicenciaGetAll: 'Licencia/GetAll',
			BusquedaProveedor: 'Proveedor/BusquedaProveedor',
			GetSoftware: 'Software/GetAllCombo',
			GetLocal: 'Local/GetAll1',
			GetLstProveedoresByFilter: 'Proveedor/BusquedaProveedor',
			GetLstAreaByFilter: 'Area/BusquedaArea',
			GetLstPersonaByFilter: 'Persona/BusquedaSolicitante',
			GetEscuela: 'Escuela/GetAll',
			GetAllTipoMoneda: 'TipoMoneda/GetAll1',
			PostGetAllTipoLicencia: 'TipoLicencia/GetAll',
			PostGuardarLicencia: 'Licencia/Guardar',
			PostActualizarLicencia: 'Licencia/Actualizar',
			GetByIdLicencia: 'Licencia/GetById',
			PostEliminarLicencia: 'Licencia/Update'
		}
	},
	endpointGoogleDrive: 'https://ucvapiqa.azure-api.net/gdriveqa/Drive',
	apiKeyUser: 'yLPHaYGzLE5c2LhtSbeL0r1oWocC',
	apiKeyPass: '4dKtykbacYR1u59jRXi9fX03341i',
	apiTokenUrl: 'https://ucvapi.azure-api.net/jwttrilce/v1/api/Token/Login',
	cDominio: 'trilce.qa.ucv.edu.pe',
};
