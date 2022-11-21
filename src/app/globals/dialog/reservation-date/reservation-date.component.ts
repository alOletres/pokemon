import { Component, OnInit,Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICottage } from '../../interface/cottage';
import { StoreService } from '../../../store/service/store.service';
import { IBook } from '../../interface/book';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-reservation-date',
  templateUrl: './reservation-date.component.html',
  styleUrls: ['./reservation-date.component.css']
})
export class ReservationDateComponent implements OnInit {
	dateForm!: FormGroup;
	minDate = new Date();
  constructor(
		public dialogRef: MatDialogRef<ReservationDateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ICottage,
		private fb: FormBuilder,
		private router: Router,
		private dialog: MatDialog,
		private store_method: StoreService,
	) {
		
		this.dateForm = this.fb.group({
			start: [null, Validators.required],
			end: [null, Validators.required]
		});
	}

	get start () {
		return this.dateForm.get('start');
	}

	get end () {
		return this.dateForm.get('end');
	}

  ngOnInit(): void {

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
			this.dialog.open(SignInComponent, { width: '400px', disableClose: true, data: {...this.dateForm.value, ...this.data} })
			
		}
	}

}
