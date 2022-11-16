export interface IResponse<T> {
	message: string;
	data?: T;
}

export interface ISecret {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface ILogin {
	email: string;
	password: string;
}

export interface IColumnSchema {
	key: string;
	type: string;
	label: string;
}