import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { StoreService } from '../../../store/service/store.service';
import { IBook } from '../../interface';
import { IBookPayload } from '../../interface/cottage';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
	sign_inForm!: FormGroup;
  constructor(
		public dialogRef: MatDialogRef<SignInComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: IBookPayload,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private store_method: StoreService,) {
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

	guest() {
		const book = {
			id: this.data.id,
			cottage: this.data.id,
			selected_date_from: this.data.start,
			selected_date_to: this.data.end,
			payment_type: "gcash",
		} as IBook;
		this.store_method.addToCottage(book);
		
	}

}
