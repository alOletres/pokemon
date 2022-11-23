import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from './../../../../store/model/appState.model';
import { IBookAndCottagePayload } from '../../../../globals/interface/book';
import { EMage } from '../../../../globals/enums/image';
import * as moment from 'moment';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { StoreService } from '../../../../store/service/store.service';
import { BookService } from './book.service';
import { IUser } from '../../../../globals/interface/payload';

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
	file!: File;
	receiptPhoto: string = "assets/receipt.jpg";

	dataCottageBook!: IBookAndCottagePayload[];

	startDate: string = "";
	endDate: string = "";
	numberOfDays: number = 0;
	totalAmount: number = 0;

	user!: IUser;

  constructor(
		private fb: FormBuilder, 
		private store: Store<AppState>, 
		private snackBar: SnackBarService,
		private store_method: StoreService,
		private http_book: BookService,
		) {

		store.select("user").subscribe((data): void => {
			try {
				this.user = data[0];
			} catch (Err) {
				return undefined
			}
		});

		
		



		this.paymentForm = this.fb.group({
			accountName: [null, Validators.required],
			accountNumber: [null, Validators.required],
			reference: [null, Validators.required],
			amount: [null, Validators.required],
			images: [null, Validators.required],
			remarks: null,

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
		
		this.bookForm = this.fb.group({
			firstname: [(!this.user)? null: this.user.firstname, Validators.required],
			lastname: [(!this.user)? null: this.user.lastname, Validators.required],
			contact: [(!this.user)? null: this.user.mobile_number, Validators.required],
			event: [null, Validators.required],
			address:[(!this.user)? null: this.user.address, Validators.required],
			
			isCottage: [null, Validators.required],
			comment: null,

		});

		this.bookForm.patchValue({isCottage: this.dataCottageBook.length > 0 ? 1 : null});
  }

	onNextBook(): void {
		if(this.bookForm.invalid || this.dataCottageBook.length === 0) {
			this.bookForm.markAllAsTouched();
			this.snackBar._showSnack("Oops! Something went wrong", "error");
		} else {

		}
	}

	changeImage(event: any) {

		this.file = event.target.files[0];

		const reader = new FileReader();
		
		reader.readAsDataURL(this.file);

		reader.onload = (event: any) => {
			this.receiptPhoto = event.target.result
		}

		this.paymentForm.get('images')?.patchValue(this.file);

	}

	async submit () {
		if (this.paymentForm.invalid) {
			this.paymentForm.markAllAsTouched();
		} else {
			const formData = new FormData();
			const data = {...this.dataCottageBook, ...this.bookForm.value, ...this.paymentForm.value};

			for (let item of Object.keys(data)) {
				formData.append(item, data[item])
			}

			const response = await this.http_book.bookCottage(formData);

			this.snackBar._showSnack(response.message, "success");	
		}
	}

	cancelCottage(element: IBookAndCottagePayload) {
		this.store_method.deleteCottage(element.id);
		this.snackBar._showSnack("Cottage Successfully cancelled!", "success");
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
