import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
	availableCottage: string[] = ['COT-0001', 'COT-0002', 'COT-0003'];
	typeCottage: string[] = ['Floating cottage', 'Non-Float cottage'];
  constructor(private fb: FormBuilder) {
		this.bookForm = this.fb.group({
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			contact: [null, Validators.required],
			event: [null, Validators.required],
			address:[null, Validators.required],		
			// type: [null, Validators.required],
			// start: [null, Validators.required],
			// end: [null, Validators.required],
			comment: null
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
  }

	onNextBook(): void {
		if(this.bookForm.invalid) {
			this.bookForm.markAllAsTouched();
		}
	}

	onPaid (): void {
		if (this.paymentForm.invalid) {
			this.paymentForm.markAllAsTouched();
		}
	}
}
