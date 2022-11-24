
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { IUser } from './../globals/interface';
@Injectable({
  providedIn: 'root'
})
export default class Method {
	constructor(private cookieService: CookieService) {}

	setCookie(key: 'accessToken' | 'refreshToken', value: string) {
		(key === 'accessToken') 
		? this.cookieService.set(key, value) 
		: this.cookieService.set(key, value);
	}

	getCookie(key: 'accessToken' | 'refreshToken') {
		return (key === 'accessToken') 
					? this.cookieService.get(key) 
					: this.cookieService.get(key); 
	}

	deleteAllCookie() {
		 this.cookieService.deleteAll();
	}

	authorization() {
		return { headers: { Authorization: `Bearer ${this.getCookie("accessToken")}`}}
	}

	landingHeader() {
		return { headers: { landing: 'true'}}
	}

	cookieDecode(key: 'accessToken' | 'refreshToken', value: string) {
		return key === "accessToken" ? jwt_decode(value) : jwt_decode(value) as IUser;
	}

	setLocalStorage(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	getLocalStorage(key: string) {
		return localStorage.getItem(key);
	}

}
