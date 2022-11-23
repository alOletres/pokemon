import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/model/appState.model';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { IUser } from '../../../globals/interface/payload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  btnName="EDIT";
  user!: IUser;
  role!: string;

  profileForm!: FormGroup;
  securityForm!: FormGroup;
  hide = true;
	hide1 = true;

  constructor(private store: Store<AppState>, private fb: FormBuilder,) {
    store.select("user").subscribe((data): void => {
      try {
        this.user = data[0];
      } catch (Err) {
        return undefined;
      }
    }); 
    
  }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      id: this.user.id,
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      email: [this.user.email, Validators.required],
      mobile_number: [this.user.mobile_number, Validators.required]
    });

    this.securityForm = this.fb.group({
      id: this.user.id,
      currentPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });

    this.securityForm.addValidators(
      this.mustMatch(this.securityForm.get('password'), this.securityForm.get('confirmPassword'))
    )

    this.strucUser();
  }

  
	mustMatch(
    control: any,
    controlTwo: any
    ): ValidatorFn {
  
    return () => {
      if (control.value !== controlTwo.value)
        return { match_error: 'Password does not match' };
      return null;
    };
  }

  strucUser(): void {
    const user: IUser[] = [this.user];
    const newArr = user.map((x) => (x.role));

    this.role = JSON.parse(newArr as any)
  }

}
