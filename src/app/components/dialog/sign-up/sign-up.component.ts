import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserMasterService } from '../../../services/user-master.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ErrorResponse } from '../../../utils/server-response';
import { SignInComponent } from '../sign-in/sign-in.component';
import { IUser } from '../../../globals/interface/payload';

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
		private fb: FormBuilder,
		private http_user: UserMasterService,
		private snackBar: SnackBarService,
		private dialog: MatDialog,) {

		this.sign_upForm = this.fb.group({
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			email: [null, Validators.required, Validators.email],
			mobile_number: [null, Validators.required],
			address: [null, Validators.required],
			password: [null, Validators.required],
			confirmPassword: [null, Validators.required],
			roles: ['customer'], //default
			
		});

		this.sign_upForm.addValidators(
      this.mustMatch(this.sign_upForm.get('password'), this.sign_upForm.get('confirmPassword'))
    )
	}

	mustMatch(
    control: any,
    controlTwo: any
    ): ValidatorFn {
  
    return () => {
      if (control.value !== controlTwo.value)
        return { match_error: 'Password does not match' };
      return null;
    };
  }

	get firstname () {
		return this.sign_upForm.get('firstname');
	}
	get lastname () {
		return this.sign_upForm.get('lastname');
	}

	get email() {
		return this.sign_upForm.get('email');
	}
	get mobile_number () {
		return this.sign_upForm.get('mobile_number');
	}
	get address () {
		return this.sign_upForm.get('address');
	}
	get password () {
		return this.sign_upForm.get('password');
	}
	get confirmPassword () {
		return this.sign_upForm.get('confirmPassword');
	}



  ngOnInit(): void {
  }

	async signUp (): Promise<void> {
		if(this.sign_upForm.invalid) {
			this.sign_upForm.markAllAsTouched();
		} else {
			try {

				const data = [this.sign_upForm.value] as any[];

				const newArr = data.map((x) => {
					x.roles = JSON.stringify(["customer"]);
					return x;
				});


				
				const response = await this.http_user.saveUser(newArr[0]);

				this.snackBar._showSnack(response.message, "success");
				this.dialogRef.close();
				// open sigin modal
				this.dialog.open(SignInComponent, {width: '500px', disableClose: true});

			} catch (err) {
				const error = ErrorResponse(err);
				this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
			}
		}
	}

}
