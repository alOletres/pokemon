import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserDetails } from './../../../globals/interface/payload';

@Injectable({
  providedIn: 'root'
})
export class UserMasterService {

  constructor(private http: HttpClient,) { }

	async saveUser(payload: IUserDetails) {
		try {
			console.log(payload);
			
		} catch (err) {
			throw err;
		}
	}
}
