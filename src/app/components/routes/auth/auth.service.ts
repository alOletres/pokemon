import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from './../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

	async login(): Promise<any>{
		
		// try {
		// 	const response = this.http.get(`${environment.ENDPOINT_DEV}`) as Observable<any>;
		// 	return await firstValueFrom(response);
		// } catch (err) {
		// 	throw err;
		// }
	}
}
