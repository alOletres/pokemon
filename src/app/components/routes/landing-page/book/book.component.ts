import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from './../../../../store/model/appState.model';
import { IBookAndCottagePayload } from '../../../../globals/interface/book';
import { EMage } from '../../../../globals/enums/image';
import * as moment from 'moment';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
	isEditable = false;
	bookForm!: FormGroup;
	cottageForm!: FormGroup;
	paymentForm!: FormGroup;
	base64 = EMage.BASE64_INITIAL;

	availableCottage: string[] = ['COT-0001', 'COT-0002', 'COT-0003'];
	typeCottage: string[] = ['Floating cottage', 'Non-Float cottage'];

	dataCottageBook!: IBookAndCottagePayload[];

	startDate: string = "";
	endDate: string = "";
	numberOfDays: number = 0;
	totalAmount: number = 0;

  constructor(
		private fb: FormBuilder, 
		private store: Store<AppState>, 
		private snackBar: SnackBarService,
		) {
		this.bookForm = this.fb.group({
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			contact: [null, Validators.required],
			event: [null, Validators.required],
			address:[null, Validators.required],
			comment: null,
			
			isCottage: [null, Validators.required]

		});

		this.paymentForm = this.fb.group({
			accountName: [null, Validators.required],
			accountNumber: [null, Validators.required],
			reference: [null, Validators.required],
			amount: [null, Validators.required],
			remarks: null
		});

		this.cottageForm = this.fb.group({
			type: ['Floating cottage', Validators.required],
			availableCottage: [null, Validators.required],
			event: ['Birthday', Validators.required],
		});

		/**
		 * display cottage book
		 */

		store.select("cottage").subscribe((data): void => {
			try {
				this.dataCottageBook = data;

				this.startDate = moment(data[0].start).format("MM-DD-YYYY");
				this.endDate = moment(data[0].end).format("MM-DD-YYYY");

				const totalDays = diff_minutes(new Date(data[0].end), new Date(data[0].start));

				this.numberOfDays = totalDays;

				this.totalAmount = totalAmount(this.dataCottageBook);

			} catch (err) {
				return undefined
			}
			
		});

	}

	get accountName () {
		return this.bookForm.get('accountName');
	}
	get accountNumber () {
		return this.bookForm.get('accountNumber');
	}
	get reference () {
		return this.bookForm.get('reference');
	}
	get amount () {
		return this.bookForm.get('amount');
	}
	get remarks () {
		return this.bookForm.get('remarks');
	}
	get firstname () {
		return this.bookForm.get('firstname');
	}

	get lastname () {
		return this.bookForm.get('lastname');
	}

	get contact () {
		return this.bookForm.get('contact');
	}

	get event () {
		return this.bookForm.get('event');
	}

	get address () {
		return this.bookForm.get('address');
	}

	// get type () {
	// 	return this.bookForm.get('type');
	// }

	get start () {
		return this.bookForm.get('start');
	}

	get end () {
		return this.bookForm.get('end');
	}

	get comment () {
		return this.bookForm.get('comment');
	}

  ngOnInit(): void {
		this.bookForm.patchValue({isCottage: this.dataCottageBook.length > 0 ? 1 : null});
  }

	onNextBook(): void {
		if(this.bookForm.invalid || this.dataCottageBook.length === 0) {
			this.bookForm.markAllAsTouched();
			this.snackBar._showSnack("Oops! Something went wrong", "error");
		} else {

		}
	}

	onPaid (): void {
		if (this.paymentForm.invalid) {
			this.paymentForm.markAllAsTouched();
		}
	}
}

const diff_minutes = (dayTwo: Date, dayOne: Date) => {
	let diff =(dayTwo.getTime() - dayOne.getTime()) / 1000;
	diff /= 60;
	const minutes = Math.abs(Math.round(diff));
	const days = (minutes === 1440) ? minutes / 60 / 24 
						 : (minutes !== 1440 && minutes > 1440) ? minutes / 60 / 24 : 0
  return  Math.abs(Math.round(days))
}

const totalAmount = (data: IBookAndCottagePayload[]): number => {
	let total = 0;
	data.forEach((x) => (total += x.price));

	return total
}
