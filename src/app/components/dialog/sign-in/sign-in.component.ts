import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { StoreService } from '../../../store/service/store.service';
import { IBook, IUser } from '../../../globals/interface';
import { IBookPayload } from '../../../globals/interface/cottage';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { IBookAndCottagePayload } from '../../../globals/interface/book';
import { AuthService } from '../../routes/auth/auth.service';
import { ErrorResponse } from '../../../utils/server-response';
import Method from '../../../utils/method';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
	sign_inForm!: FormGroup;
  constructor(
		public dialogRef: MatDialogRef<SignInComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: IBookAndCottagePayload,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private store_method: StoreService,
		private snackBar: SnackBarService,
		private router: Router,
		private http_auth: AuthService,
		private method: Method,) {
			this.sign_inForm = this.fb.group({
				email: [null, Validators.required],
				password: [null, Validators.required]
			});

		}
	
	get email () {
		return this.sign_inForm.get('email');
	}

	get password () {
		return this.sign_inForm.get('password');
	}

  ngOnInit(): void {
  }

	async signIn() {
		if(this.sign_inForm.invalid) {
			this.sign_inForm.markAllAsTouched();
		} else {

			try {
				const response = await this.http_auth.login(this.sign_inForm.value);

				this.snackBar._showSnack(response.message, "success");
				// save here the user details;
				const accessToken = response.data?.accessToken as string
				const userDetails = this.method.cookieDecode("accessToken", accessToken) as IUser;

				// save in cookie services;

				this.method.setCookie("accessToken", accessToken);
				this.method.setCookie("refreshToken", response.data?.refreshToken as string);
			
				// save in store management 
				this.store_method.addToUser(userDetails);


			} catch (err) {
				const error = ErrorResponse(err);
				this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
			}

		}
	}

	signUp(): void {
		this.dialogRef.close();
		this.dialog.open(SignUpComponent, {width: '400px', disableClose: true});
	}

}
