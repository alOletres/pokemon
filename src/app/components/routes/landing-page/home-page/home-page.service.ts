import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICottage, IResponse } from './../../../../globals/interface';
import { ENDPOINT } from '../../../../globals/models/endpoint';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private http: HttpClient,) { }

  async getCottage(): Promise<IResponse<ICottage[]>> {
		try {
			const response = this.http.get<IResponse<ICottage[]>>(`${ENDPOINT.RESORT}/cottage/list/${'all'}`, {headers: {landing: 'true'}});
			return await lastValueFrom(response);
		} catch (err) {
			throw err;
		}
	}
}
