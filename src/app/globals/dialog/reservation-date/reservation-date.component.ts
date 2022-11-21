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

@Component({
  selector: 'app-reservation-date',
  templateUrl: './reservation-date.component.html',
  styleUrls: ['./reservation-date.component.css']
})
export class ReservationDateComponent implements OnInit {
	dateForm!: FormGroup;
	minDate = new Date();

	dataBook!: IBookAndCottagePayload[];

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
				console.log(data);
				
			} catch (err) {
				return undefined;
			}
		});

	}

	get start () {
		return this.dateForm.get('start');
	}

	get end () {
		return this.dateForm.get('end');
	}

  ngOnInit(): void {

		console.log(this.dataBook);
		

		if(this.dataBook.length > 0) {
			this.dateForm = this.fb.group({
				start: [
					{
						disabled: true, 
						value: new Date(this.dataBook[0].start)
					}, Validators.required
				],
				end: [
					{
						disabled: true, 
						value: new Date(this.dataBook[0].end)
					}, Validators.required
				]
			});
		} else {
			this.dateForm = this.fb.group({
				start: [null, Validators.required],
				end: [null, Validators.required]
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

			const isOK = confirm("Are you a Guest?");

			if(!isOK) {
				this.dialog.open(SignInComponent, { width: '400px', disableClose: true, data: {...this.dateForm.value, ...this.data} })
			} else {

				const data = [this.data];

				const newArr = data.map((x) => {
					const type = x.payment_type = "gcash";
					x.payment_type = type;
					x.start = this.start?.value,
					x.end = this.end?.value
					return x;
				});
				
				this.store_method.addToCottage(newArr[0]);

				this.snackBar._showSnack("Cottage Successfully Added temporarily!", "success");
				this.router.navigate(['/book'])
			}
		
		}
	}

}
