import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserMasterService } from './user-master.service';
import { ErrorResponse } from '../../../utils/server-response';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from '../../../globals/interface/payload';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IColumnSchema } from '../../../globals/interface/default';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {

	columnSchema: IColumnSchema[] = [
		{
			key: "firstname",
			type: "text",
			label: "fistname"
		},
		{
			key: "lastname",
			type: "text",
			label: "lastname"
		},
		{
			key: "email",
			type: "text",
			label: "email"
		},
		{
			key: "mobile_number",
			type: "text",
			label: "mobile number"
		},
		{
			key: "roles",
			type: "text",
			label: "role"
		},
		{
			key: "isEdit",
			type: "isEdit",
			label: "Action"
		}
	];

	displayColumns: string[] = this.columnSchema.map((x) => (x.key));

	userRole: string[] = ['admin', 'customer', 'staff'];
	userForm!: FormGroup;

	btnName: string = "Save User";

	public dataUser = new MatTableDataSource<IUser>([]);
	@ViewChild('userPaginator') userPaginator !: MatPaginator;
	@ViewChild("userSort") userSort!: MatSort;

  constructor(private fb: FormBuilder, private http_user: UserMasterService, private snackBar: SnackBarService,) {
		this.userForm = this.fb.group({
			id: null,
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			email: [null, Validators.required],
			mobile_number: [null, Validators.required],
			roles: [null, Validators.required],
			password: null,
		});
	}



	get firstname () {
		return this.userForm.get('firstname');
	}

	get lastname () {
		return this.userForm.get('lastname');
	}

	get email() {
		return this.userForm.get('email');
	}

	get mobile_number () {
		return this.userForm.get('mobile_number');
	}

	get roles () {
		return this.userForm.get('roles');
	}
  ngOnInit(): void {
		this.getUser();
  }

	ngAfterViewInit(): void {
		this.dataUser.paginator = this.userPaginator;
		this.dataUser.sort = this.userSort;
	}

	passValue(element: IUser) {
		
		this.userForm.patchValue({
			id: element.id,
			firstname: element.firstname,
			lastname: element.lastname,
			email: element.email,
			mobile_number: element.mobile_number,
			roles: element.roles,
		});

		this.btnName = "Update User";
	}

	async saveUser () {
		try {
			if (this.userForm.invalid) {
				this.userForm.markAllAsTouched();
			} else {

				if(this.btnName === "Save User") {
					
					this.userForm.patchValue({password: 'test'}); //default password 'test'

					const response = await this.http_user.saveUser(this.userForm.value);
					this.snackBar._showSnack(response.message, "success");
					this.ngOnInit();

				} else {

					const response = await this.http_user.updateUser(this.userForm.value);
					this.ngOnInit();
					this.snackBar._showSnack(response.message, "success");
					

					
				}
				
			}
		} catch (err) {
			const error = ErrorResponse(err);
			this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
		}	
	}


	async getUser() {
		try {
			const response = await this.http_user.getUser();
			this.dataUser.data = response.data as IUser[];
		} catch (err) {
			const error = ErrorResponse(err);
			this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
		}
	}

}
