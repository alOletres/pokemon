import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
	sign_upForm: FormGroup;
  constructor(
		public dialogRef: MatDialogRef<SignUpComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder) {
		this.sign_upForm = this.fb.group({
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			contact: [null, Validators.required],
			address: [null, Validators.required],
			password: [null, Validators.required],
			re_typePassword: [null, Validators.required]
		});
	}

	get firstname () {
		return this.sign_upForm.get('firstname');
	}
	get lastname () {
		return this.sign_upForm.get('lastname');
	}
	get contact () {
		return this.sign_upForm.get('contact');
	}
	get address () {
		return this.sign_upForm.get('address');
	}
	get password () {
		return this.sign_upForm.get('password');
	}
	get re_typePassword () {
		return this.sign_upForm.get('re_typePassword');
	}
  ngOnInit(): void {
  }

	signUp (): void {
		if(this.sign_upForm.invalid) {
			this.sign_upForm.markAllAsTouched();
		} else {
			this.dialogRef.close();
		}
	}

}
