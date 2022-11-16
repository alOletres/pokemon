import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CottageMasterService } from './cottage-master.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ErrorResponse } from '../../../utils/server-response';
import { CommonServiceService } from '../../../globals/services/common-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { IColumnSchema, ICottage } from '../../../globals/interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-cottage-master',
  templateUrl: './cottage-master.component.html',
  styleUrls: ['./cottage-master.component.css']
})
export class CottageMasterComponent implements OnInit {
	cottageForm!: FormGroup;
	typeList: string[] = ['floating', 'non-floating'];
	file!: File;
	url: string | ArrayBuffer  = "assets/addPhoto.jpg";
	dataCottage = new MatTableDataSource<ICottage>([]);
	@ViewChild('cottagePaginator') cottagePaginator!: MatPaginator ;
	@ViewChild('cottageSort') cottageSort!: MatSort;

	column_schema: IColumnSchema[] = [
		{
			key: "images",
			type: "images",
			label: "image"
		},
		{
			key: "type",
			type: "text",
			label: "cottage type"
		},
		{
			key: "cottageNumber",
			type: "text",
			label: "cottage number"
		},
		{
			key: "capacity",
			type: "text",
			label: "capacity"
		},
		{
			key: "description",
			type: "text",
			label: "description"
		},
		{
			key: "price",
			type: "number",
			label: "price"
		},
		{
			key: "isEdit",
			type: "isEdit",
			label: "Action"
		}
	];

	displayColumns: string[] = this.column_schema.map((x) => (x.key));

  constructor(
		private fb: FormBuilder, 
		private http_cottage: CottageMasterService, 
		private snackBar: SnackBarService,
		private common: CommonServiceService,) {
		this.cottageForm = this.fb.group({
			type: [null, Validators.required],
			cottageNumber: [null, Validators.required],
			capacity: [null, Validators.required],
			price: [null, Validators.required],
			description: [null, Validators.required],
			images: [null, Validators.required],
		});

	}

	get type () {
		return this.cottageForm.get('type');
	}

	get cottageNumber () {
		return this.cottageForm.get('cottageNumber');
	}

	get capacity () {
		return this.cottageForm.get('capacity');
	}

	get price () {
		return this.cottageForm.get('price');
	}

	get description () {
		return this.cottageForm.get('description');
	}

  ngOnInit(): void {
		this.getCottage();
  }

	ngAfterViewInit(): void {
		this.dataCottage.paginator = this.cottagePaginator;
		this.dataCottage.sort = this.cottageSort;
	}

	changeImage(event: any) {

		this.file = event.target.files[0];

		const reader = new FileReader();
		
		reader.readAsDataURL(this.file);

		reader.onload = (event: any) => { this.url = event.target.result}

		this.cottageForm.get('images')?.patchValue(this.file);
	}

	async saveCottage () {
		if (this.cottageForm.invalid) {
			this.cottageForm.markAllAsTouched();
		} else {
			try {
				
				const formData = new FormData();

				formData.append("images", this.file);
				formData.append('payload', JSON.stringify(this.cottageForm.value));

				const response = await this.http_cottage.saveCottage(formData);
				this.snackBar._showSnack(response.message, "success");
				this.common.reset(this.cottageForm);
				this.url = "assets/addPhoto.jpg";
				this.ngOnInit();
				
			} catch (err) {
				const error = ErrorResponse(err);
				this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
			}
		}
	}
	
	async getCottage() {
		try {
			const response = await this.http_cottage.getCottage();
			this.snackBar._showSnack(response.message, "success");
			this.dataCottage.data = response.data as ICottage[];

			console.log(this.dataCottage.data);
			
		} catch (err) {
			const error = ErrorResponse(err);
			this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
		}
	}
}
