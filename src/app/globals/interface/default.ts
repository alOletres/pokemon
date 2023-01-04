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

export interface ISwalCustom {
	title: string;
	input: 'email' | 'text' | 'password';
	inputLabel: string;
	inputPlaceholder: string;
}

export interface INewWindow<T> {
	url: string;
	payload: T;
}

export interface IUpdateStatus {
	id?: number;
	status: string;
	reason: string;
}


