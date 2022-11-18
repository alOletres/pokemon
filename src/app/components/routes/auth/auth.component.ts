import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ErrorResponse } from './../../../utils';
import Method from '../../../utils/method';

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
			const userDetails = this.method.cookieDecode("accessToken", accessToken);

			this.method.setCookie("accessToken", accessToken);
			this.method.setCookie("refreshToken", response.data?.refreshToken as string);

			this.route.navigate(['/dash-board']).then(() => (location.reload()));

		} catch (err) {

			console.log(err);
			
			
			const error = ErrorResponse(err);
			this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
		}
	}



}
