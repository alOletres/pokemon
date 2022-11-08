import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserMasterService } from './user-master.service';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {
	userRole: string[] = ['Admin', 'Cashier'];
	userForm!: FormGroup;
  constructor(private fb: FormBuilder, private http_user: UserMasterService,) {
		this.userForm = this.fb.group({
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			contact: [null, Validators.required],
			role: [null, Validators.required]
		});
	}

	get firstname () {
		return this.userForm.get('firstname');
	}

	get lastname () {
		return this.userForm.get('lastname');
	}

	get contact () {
		return this.userForm.get('contact');
	}

	get type () {
		return this.userForm.get('type');
	}
  ngOnInit(): void {
  }

	async saveUser () {
		if (this.userForm.invalid) {
			this.userForm.markAllAsTouched();
		} else {
			const response = await this.http_user.saveUser(this.userForm.value);

		}
	}

}
