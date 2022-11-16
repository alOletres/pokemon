import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from './../../../globals/interface/payload';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import Method from '../../../utils/method';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { IResponse } from '../../../globals/interface/default';

@Injectable({
  providedIn: 'root'
})
export class UserMasterService {

  constructor(private http: HttpClient, private method: Method,) { }

	async saveUser(payload: IUser): Promise<IResponse<string>> {
		try {
			const response = this.http.post<IResponse<string>>(`${ENDPOINT.RESORT}/user`, payload, this.method.authorization());
			return await firstValueFrom(response);
		} catch (err) {
			throw err;
		}
	}

	async getUser(): Promise<IResponse<IUser[]>> {
		try {
			const response = this.http.get<IResponse<IUser[]>>(`${ENDPOINT.RESORT}/user/getUser`, this.method.authorization());
			return await lastValueFrom(response);
		} catch(err) {
			throw err;
		}
	}

	async updateUser(payload: IUser): Promise<IResponse<string>> {
		try {
			const response = this.http.post<IResponse<string>>(`${ENDPOINT.RESORT}/user/updateUser`, payload, this.method.authorization());
			return await firstValueFrom(response);
		} catch (err) {
			throw err;
		}
	}
}
