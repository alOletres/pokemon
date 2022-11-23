import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICottage, IResponse } from './../../../../globals/interface';
import { ENDPOINT } from '../../../../globals/models/endpoint';
import { lastValueFrom } from 'rxjs';
import Method from '../../../../utils/method';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private http: HttpClient, private method: Method) { }

  async getCottage(): Promise<IResponse<ICottage[]>> {
		try {
			const response = this.http.get<IResponse<ICottage[]>>(`${ENDPOINT.RESORT}/cottage/list/${'all'}`, this.method.landingHeader());
			return await lastValueFrom(response);
		} catch (err) {
			throw err;
		}
	}
}
