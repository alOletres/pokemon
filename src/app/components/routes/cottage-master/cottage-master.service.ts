import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CottageMasterService {

  constructor(private http: HttpClient,) { }

	async saveCottage(payload: any) {
		try {
			console.log(payload);
			
		} catch (err) {
			throw err;
		}
	}
}
