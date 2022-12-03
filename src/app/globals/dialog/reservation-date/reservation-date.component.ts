import { Component, OnInit,Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICottage } from '../../interface/cottage';
import { StoreService } from '../../../store/service/store.service';
import { IBook, IBookAndCottagePayload } from '../../interface/book';
import { SignInComponent } from '../sign-in/sign-in.component';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/model/appState.model';
import { IUser } from '../../interface/payload';

@Component({
  selector: 'app-reservation-date',
  templateUrl: './reservation-date.component.html',
  styleUrls: ['./reservation-date.component.css']
})
export class ReservationDateComponent implements OnInit {
	dateForm!: FormGroup;
	minDate = new Date();

	dataBook!: IBookAndCottagePayload[];

	user!: IUser;

  constructor(
		public dialogRef: MatDialogRef<ReservationDateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IBookAndCottagePayload,
		private fb: FormBuilder,
		private router: Router,
		private dialog: MatDialog,
		private store_method: StoreService,
		private snackBar: SnackBarService,
		private store: Store<AppState>,
	) {

		store.select("cottage").subscribe((data): void => {
			try {
				this.dataBook = data;
				
			} catch (err) {
				return undefined;
			}
		});

		store.select("user").subscribe((data): void => {
			try {
				this.user = data[0];
			} catch (err) {
				return undefined;
			}
		});

	}

	get selected_date_from () {
		return this.dateForm.get('selected_date_from');
	}

	get selected_date_to () {
		return this.dateForm.get('selected_date_to');
	}

  ngOnInit(): void {

		console.log(this.dataBook);
		

		if(this.dataBook.length > 0) {

			this.dateForm = this.fb.group({
				selected_date_from: [
					{
						disabled: true, 
						value: new Date(this.dataBook[0].selected_date_from)
					}, Validators.required
				],
				selected_date_to: [
					{
						disabled: true, 
						value: new Date(this.dataBook[0].selected_date_to)
					}, Validators.required
				]
			});
		} else {
			this.dateForm = this.fb.group({
				selected_date_from: [null, Validators.required],
				selected_date_to: [null, Validators.required]
			});
		}

  }

	fillOutInfo (): void {
		if(this.dateForm.invalid) {
			this.dateForm.markAllAsTouched();
		} else {
			this.dialogRef.close()
			this.router.navigate(['/book']);
		}
	}

	reservedCottage (): void {
		if(this.dateForm.invalid) {
			this.dateForm.markAllAsTouched();
		} else {
			this.dialogRef.close();

			// if(!this.user) {
			// 	this.dialog.open(SignInComponent, { width: '400px', disableClose: true, data: {...this.dateForm.value, ...this.data} })
			// } else {

				const data = [this.data];

				const newArr = data.map((x) => {
					x.payment_type = "gcash";
					x.selected_date_from = this.selected_date_from?.value,
					x.selected_date_to = this.selected_date_to?.value
					return x;
				});
				
				this.store_method.addToCottage(newArr[0]);

				this.snackBar._showSnack("Cottage Successfully Added temporarily!", "success");
				this.router.navigate(['/book'])
			// }
		
		}
	}

}
