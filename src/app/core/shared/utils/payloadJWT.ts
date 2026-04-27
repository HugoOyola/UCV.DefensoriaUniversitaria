export interface PayloadJWT {
	app: string;
	environment: string;
	cPerCodigo: string;
	IdDevice: string;
	exp: number;
}

export const payloadJWT = (tokenJwt: string): PayloadJWT => {
	const parts = tokenJwt.split('.');
	const payloadBase64 = parts[1];
	return JSON.parse(atob(payloadBase64));
};
