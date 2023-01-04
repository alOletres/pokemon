import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import Method from '../../../utils/method';
import { StoreService } from '../../../store/service/store.service';
import { IUser } from '../../../globals/interface/payload';
import { ESystemUser } from '../../../globals/enums/default';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
	loginForm!: FormGroup;
  constructor(
		private route: Router, 
		private fb: FormBuilder, 
		private http_auth: AuthService,
		private snackBar: SnackBarService,
		private method: Method,
		private store_method: StoreService,
		) {
		this.loginForm = this.fb.group({
			email: [null, Validators.required],
			password: [null, Validators.required]
		});
	}

	get email () {
		return this.loginForm.get('email');
	}
	get password () {
		return this.loginForm.get('password');
	}
  ngOnInit(): void {
  }

	async LoginUser() {
		try {
			const response = await this.http_auth.login(this.loginForm.value);			
	
			this.snackBar._showSnack(response.message, "success");
			const accessToken = response.data?.accessToken as string
			const userDetails = this.method.cookieDecode("accessToken", accessToken) as IUser;

			// save in cookie services;

			this.method.setCookie("accessToken", accessToken);
			this.method.setCookie("refreshToken", response.data?.refreshToken as string);
		
			// save in store management 
			this.store_method.addToUser(userDetails);
			const roles: string[] = JSON.parse(userDetails.role as string).map((x: string) => (x));

			const checkRoles = roles.filter((x) => (x === ESystemUser.CUSTOMER || x === ESystemUser.GUEST));
			
			if(checkRoles.length > 0) {
				// customer rani diri
				this.route.navigate(['/home']);
				// location.reload();
			} else {
				// admin or staff 
				this.route.navigate(['/dash-board']);
			}

		} catch (err) {
			throw err;
		}
	}



}
