
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { ISwalCustom, IUser } from './../globals/interface';
import { EMage } from '../globals/enums/image';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { INewWindow } from '../globals/interface/default';
import { IBookingPayload } from '../globals/interface/book';
@Injectable({
  providedIn: 'root'
})
export default class Method {
	constructor(private cookieService: CookieService, private router: Router) {}

	setCookie(key: 'accessToken' | 'refreshToken', value: string) {
		this.cookieService.set(key, value);
	}

	getCookie(key: 'accessToken' | 'refreshToken') {
		return this.cookieService.get(key)
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
		return jwt_decode(value) as IUser;
	}

	setLocalStorage(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	getLocalStorage(key: string) {
		return localStorage.getItem(key);
	}

	/**
	 * convert base64 to image file
	 */
	dataURItoBlob(dataURI: any) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		// const base64 = EMage.BASE64_INITIAL;
		
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
		else
				byteString = unescape(dataURI.split(',')[1]);
		
		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type:mimeString});
	}

	async customSwal({
		title,
		input,
		inputLabel,
		inputPlaceholder
	}: ISwalCustom): Promise<string> {
		const { value: payload } = await Swal.fire({
			title: title,
			input: input,
			inputLabel: inputLabel,
			inputPlaceholder: inputPlaceholder
		});
		return payload;
	}

	openNewWindow({
		url,
		payload
	}: INewWindow<IBookingPayload>): void {

		const data = JSON.stringify(payload)
		const relativeUrl = this.router.createUrlTree([`/${url}/${btoa(data)}`]);
		const baseUrl = window.location.href.replace(this.router.url, '');
		window.open(baseUrl + relativeUrl, '_blank');

	}

}


