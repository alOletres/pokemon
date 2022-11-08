import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CottageMasterService } from './cottage-master.service';

@Component({
  selector: 'app-cottage-master',
  templateUrl: './cottage-master.component.html',
  styleUrls: ['./cottage-master.component.css']
})
export class CottageMasterComponent implements OnInit {
	cottageForm!: FormGroup;
	type: string[] = ['Floating cottage', 'Non-Floating cottage'];
	fileName!: string;
	file!: File
  constructor(private fb: FormBuilder, private http_cottage: CottageMasterService,) {
		this.cottageForm = this.fb.group({
			cottageType: [null, Validators.required],
			cottageNumber: [null, Validators.required],
			capacity: [null, Validators.required],
			cottagePrice: [null, Validators.required],
			description: [null, Validators.required],
			image: [null, Validators.required],
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

	get description () {
		return this.cottageForm.get('description');
	}

  ngOnInit(): void {
  }

	changeImage(event: any) {
    this.file = event.target.files[0];
		if(this.file) {
			this.fileName = this.file.name;
		}
		
	}

	async saveCottage () {
		if (this.cottageForm.invalid) {
			this.cottageForm.markAllAsTouched();
		} else {
			try {
				const formData = new FormData();
				formData.append("thumbnail", this.file);
				
				const response = await this.http_cottage.saveCottage(this.cottageForm.value);
				
			} catch (err) {
				throw err;
			}
		}
	}

}
