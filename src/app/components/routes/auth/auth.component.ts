import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
	loginForm!: FormGroup;
  constructor(private route: Router, private fb: FormBuilder, private http_auth: AuthService) {
		this.loginForm = this.fb.group({
			username: [null, Validators.required],
			password: [null, Validators.required]
		});
	}

	get username () {
		return this.loginForm.get('username');
	}
	get password () {
		return this.loginForm.get('password');
	}
  ngOnInit(): void {
  }

	async LoginUser() {
		try {
			const response = await this.http_auth.login();
			this.route.navigate(['/dash-board']);
		} catch (err) {
			throw err
		}
	}



}
