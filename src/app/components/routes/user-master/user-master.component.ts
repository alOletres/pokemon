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
import { CommonServiceService } from '../../../globals/services/common-service.service';

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
			key: "role",
			type: "roles",
			label: "role"
		},
		{
			key: "isEdit",
			type: "isEdit",
			label: "Action"
		}
	];

	displayColumns: string[] = this.columnSchema.map((x) => (x.key));

	userRole: string[] = ['admin', 'staff'];
	userForm!: FormGroup;
	btnName: string = "Save User";

	public dataUser = new MatTableDataSource<IUser>([]);
	@ViewChild('userPaginator') userPaginator !: MatPaginator;
	@ViewChild("userSort") userSort!: MatSort;

  constructor(
		private fb: FormBuilder, 
		private http_user: UserMasterService, 
		private snackBar: SnackBarService,
		private common: CommonServiceService,) {
		this.userForm = this.fb.group({
			id: null,
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			email: [null, Validators.required],
			mobile_number: [null, Validators.required],
			roles: [null, Validators.required],
			password: null,
			address: 'address',
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
		const roles = element.role as string[];

		this.userForm.patchValue({
			id: element.id,
			firstname: element.firstname,
			lastname: element.lastname,
			email: element.email,
			mobile_number: element.mobile_number,
			roles: roles.map((x) => (x)),
		});

		this.btnName = "Update User";
	}

	async saveUser () {
		try {
			if (this.userForm.invalid) {
				this.userForm.markAllAsTouched();
			} else {
				this.userForm.patchValue({password: 'test'});

				const data = [this.userForm.value];

				const element = data.map((x) => {
					x.roles = JSON.stringify(x.roles);
					return x;
				});

				if(this.btnName === "Save User") {
					
					const response = await this.http_user.saveUser(element[0]);
					this.snackBar._showSnack(response.message, "success");

					this.common.reset(this.userForm);
					this.ngOnInit();

				} else {

					const response = await this.http_user.updateUser(element[0]);
					this.ngOnInit();
					this.snackBar._showSnack(response.message, "success");
					this.common.reset(this.userForm);
			
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
			
			const data = response.data as IUser[];
			const result = data.map((x) => {

				const roles = JSON.parse(x.role as string);
				x.role = roles;
				return x;

			});

			this.dataUser.data = result;
		
		} catch (err) {
			const error = ErrorResponse(err);
			this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
		}
	}

}
