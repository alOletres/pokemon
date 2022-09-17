import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cottage-master',
  templateUrl: './cottage-master.component.html',
  styleUrls: ['./cottage-master.component.css']
})
export class CottageMasterComponent implements OnInit {
	cottageForm!: FormGroup;
	type: string[] = ['Floating cottage', 'Non-Floating cottage'];
  constructor(private fb: FormBuilder) {
		this.cottageForm = this.fb.group({
			cottageType: [null, Validators.required],
			cottageNumber: [null, Validators.required],
			capacity: [null, Validators.required],
			cottagePrice: [null, Validators.required]
		});
	}

	get cottageType () {
		return this.cottageForm.get('cottageType');
	}

	get cottageNumber () {
		return this.cottageForm.get('cottageNumber');
	}

	get capacity () {
		return this.cottageForm.get('capacity');
	}

	get cottagePrice () {
		return this.cottageForm.get('cottagePrice');
	}

  ngOnInit(): void {
  }

	saveCottage () {
		try {
			if (this.cottageForm.invalid) {
				this.cottageForm.markAllAsTouched();
			} else {

			}
		} catch (err) {
			console.log(err);
			
		}
	}

}
