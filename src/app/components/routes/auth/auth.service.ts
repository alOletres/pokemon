import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import { ILogin, IResponse, ISecret } from '../../../globals/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

	async login(payload: ILogin): Promise<IResponse<ISecret>>{
		
		try {
			const response = this.http.post<IResponse<ISecret>>(`${ENDPOINT.RESORT}/authenticate`, payload);
			return await firstValueFrom(response);
		} catch (err) {
			throw err;
		}
	}
}
