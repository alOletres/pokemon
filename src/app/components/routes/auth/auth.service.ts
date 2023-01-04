import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import { ILogin, IResponse, ISecret } from '../../../globals/interface';
import Method from '../../../utils/method';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
		private http: HttpClient, 
		private method: Method, 
		private router: Router,
		private cookie: CookieService) { }

	async login(payload: ILogin): Promise<IResponse<ISecret>>{
		
		try {
			const response = this.http.post<IResponse<ISecret>>(`${ENDPOINT.RESORT}/authenticate`, payload);
			return await firstValueFrom(response);
		} catch (err) {
			console.log(err);
			
			throw err;
		}
	}

	async refresh_token(): Promise<IResponse<ISecret>>{
		try {
			const url = this.http.post<IResponse<ISecret>>(`${ENDPOINT.RESORT}/authenticate/refresh`, this.method.getCookie("refreshToken"));
			const response = await firstValueFrom(url);
			return response;			
		} catch (err) {
			throw err;
		}
	}

	signOut() {
		this.router.navigate(['/login']);
		localStorage.clear();
		this.cookie.deleteAll();
	}
}
