import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  } from '../../../globals/interface/payload';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import Method from '../../../utils/method';
import { ICottage, IResponse } from '../../../globals/interface';

@Injectable({
  providedIn: 'root'
})
export class CottageMasterService {

  constructor(private http: HttpClient, private method: Method) { }
	async saveCottage(payload: FormData): Promise<any> {
		try {
			const response = this.http.post<IResponse<string>>(`${ENDPOINT.RESORT}/cottage`, payload, this.method.authorization());
			return await firstValueFrom(response);
		} catch (err) {
			throw err;
		}
	}

	async getCottage(): Promise<IResponse<ICottage[]>> {
		try {
			const response = this.http.get<IResponse<ICottage[]>>(`${ENDPOINT.RESORT}/cottage/list/all`, this.method.authorization());
			return await lastValueFrom(response);
		} catch (err) {
			throw err;
		}
	}

	async updateCottage(payload: FormData): Promise<any> {
		
		try {
			const response = this.http.post(`${ENDPOINT.RESORT}/cottage/edit/${payload.get("id")}`, payload, this.method.authorization());
			return await firstValueFrom(response);
		} catch (err) {
			throw err;
		}
	}
}
