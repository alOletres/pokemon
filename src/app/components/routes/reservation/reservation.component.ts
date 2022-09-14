import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../../globals/services/common-service.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  reservationForm!: FormGroup;
	cottageList: string[] = ['#01', '#02', '#03', '#04', '#05'];
  constructor(private fb: FormBuilder, private http_common: CommonServiceService) {
		this.reservationForm = this.fb.group({
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			contact: [null, Validators.required],
			address: [null, Validators.required],
			cottage: [null, Validators.required],
			dateReserved: [null, Validators.required],
			comment: ['N/A', Validators.required]	
		});
	}

	get firstname () {
		return this.reservationForm.get('firstname'); 
	}

	get lastname () {
		return this.reservationForm.get('lastname'); 
	}

	get contact () {
		return this.reservationForm.get('contact');
	}

	get address () {
		return this.reservationForm.get('address');
	}

	get cottage () {
		return this.reservationForm.get('cottage');
	}

	get dateReserved () {
		return this.reservationForm.get('dateReserved');
	}

	get comment () {
		return this.reservationForm.get('comment');
	}
  ngOnInit(): void {
  }

	reservedCottage() {
		if(this.reservationForm.invalid) {
			this.reservationForm?.markAllAsTouched();
		} else {
		}
	}

	clearForm () {
		this.http_common.reloadCurrentRoute()
	}

}
