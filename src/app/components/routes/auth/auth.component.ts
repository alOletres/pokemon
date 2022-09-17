import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
	loginForm!: FormGroup;
  constructor(private route: Router, private fb: FormBuilder) {
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

	LoginUser() {
		try {
			this.route.navigate(['/dash-board']);
		} catch (err) {
			throw err
		}
	}

}
