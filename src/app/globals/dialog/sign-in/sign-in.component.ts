import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
	sign_inForm!: FormGroup;
  constructor(
		public dialogRef: MatDialogRef<SignInComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private dialog: MatDialog) {
			this.sign_inForm = this.fb.group({
				username: [null, Validators.required],
				password: [null, Validators.required]
			});
		}
	
	get username () {
		return this.sign_inForm.get('username');
	}

	get password () {
		return this.sign_inForm.get('password');
	}

  ngOnInit(): void {
  }

	signIn(): void {
		if(this.sign_inForm.invalid) {
			this.sign_inForm.markAllAsTouched();
		}
	}

	signUp(): void {
		this.dialogRef.close();
		this.dialog.open(SignUpComponent, {width: '400px', disableClose: true});
	}

}
