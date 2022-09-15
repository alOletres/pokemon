import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {
	userType: string[] = ['Admin', 'Cashier'];
	userForm!: FormGroup;
  constructor(private fb: FormBuilder) {
		this.userForm = this.fb.group({
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			contact: [null, Validators.required],
			type: [null, Validators.required]
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

	saveUser () {
		if (this.userForm.invalid) {
			this.userForm.markAllAsTouched();
		} else {

		}
	}

}
