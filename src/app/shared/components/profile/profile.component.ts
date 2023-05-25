import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/model/appState.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { IUser } from '../../../globals/interface/payload';
import { SnackBarService } from '../../services/snack-bar.service';
import { ErrorResponse } from '../../../utils/server-response';
import { UserMasterService } from '../../../services/user-master.service';
import { AuthService } from '../../../components/routes/auth/auth.service';
import { BookService } from '../../../services/book.service';
import {
  IBook,
  IBookingPayload,
  IDBPayment,
  IPayment,
} from '../../../globals/interface/book';
import { MatTableDataSource } from '@angular/material/table';
import { IColumnSchema, ICottage } from 'src/app/globals/interface';
import { CottageMasterService } from 'src/app/services/cottage-master.service';
import Method from '../../../utils/method';
import { EMage } from 'src/app/globals/enums/image';
import { PaymentService } from '../../../services/payment.service';
import { CommonServiceService } from '../../../services/common-service.service';
import { BookDetailsComponent } from 'src/app/components/dialog/book-details/book-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  btnName = 'EDIT';
  user!: IUser;
  role!: string;

  profileForm!: FormGroup;
  securityForm!: FormGroup;
  hide = true;
  hide1 = true;
  data_booked = new MatTableDataSource<IBook>([]);

  data_user!: IUser[];

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private snackBar: SnackBarService,
    private http_user: UserMasterService,
    private http_auth: AuthService,
    private http_book: BookService,
    private dialog: MatDialog
  ) {
    store.select('user').subscribe((data): void => {
      try {
        this.user = data[0];
      } catch (Err) {
        return undefined;
      }
    });

    this.profileForm = this.fb.group({
      id: null,
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, Validators.required],
      mobile_number: [null, Validators.required],
      roles: null,
    });

    this.securityForm = this.fb.group({
      id: null,
      current_password: [null, Validators.required],
      new_password: [null, Validators.required],
      confirm_password: [null, Validators.required],
    });

    this.securityForm.addValidators(
      this.mustMatch(
        this.securityForm.get('new_password'),
        this.securityForm.get('confirm_password')
      )
    );
  }

  ngOnInit(): void {
    Promise.resolve().then(() => {
      this.strucUser();
      this.getUser();
      this.getBook();
    });
  }

  mustMatch(control: any, controlTwo: any): ValidatorFn {
    return () => {
      if (control.value !== controlTwo.value)
        return { match_error: 'Password does not match' };
      return null;
    };
  }

  strucUser(): void {
    const user: IUser[] = [this.user];
    const newArr = user.map((x) => x.role);

    this.role = JSON.parse(newArr as any);
  }

  async getUser() {
    try {
      const response = await this.http_user.getUser();
      const data = response.data as IUser[];

      const user = data.filter((x) => x.id === this.user.id);

      const roles = JSON.parse(user[0].role as string) as string[];
      const set_roles = roles.map((x) => x);

      this.profileForm.patchValue({
        id: user[0]['id'],
        firstname: user[0]['firstname'],
        lastname: user[0]['lastname'],
        email: user[0]['email'],
        mobile_number: user[0]['mobile_number'],
        roles: JSON.stringify(set_roles),
      });

      this.data_user = user;
    } catch (err) {
      const error = ErrorResponse(err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, 'error');
    }
  }

  async updateUser(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
    } else {
      try {
        const response = await this.http_user.updateUser(
          this.profileForm.value
        );
        this.snackBar._showSnack(response.message, 'success');
        this.ngOnInit();
      } catch (err) {
        const error = ErrorResponse(err);
        this.snackBar._showSnack(`${error.myError} ${error.status}`, 'error');
      }
    }
  }

  async updatePassword(): Promise<void> {
    try {
      this.securityForm.get('id')?.patchValue(this.user.id);
      const response = await this.http_user.updatePassword(
        this.securityForm.value
      );
      this.snackBar._showSnack(response.message, 'success');
      alert('System logout...');

      this.http_auth.signOut();
    } catch (err) {
      const error = ErrorResponse(err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, 'error');
    }
  }

  async getBook() {
    try {
      const response = await this.http_book.getBook();
      const data = response.data as IBook[];
      const result = data
        .filter((x) => x.booker === this.user.id)
        .map((value) => {
          value.complete_name = `${value.firstname} ${value.lastname}`;
          return value;
        });
      this.data_booked.data = result;
    } catch (err) {
      const error = ErrorResponse(err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, 'error');
    }
  }

  async openDialog(payload: IBookingPayload): Promise<void> {
    /**
     * step 1 get cottage
     */
    const dialogRef = this.dialog.open(BookDetailsComponent, {
      width: '1000px',
      disableClose: true,
      data: { payload, user: [...this.data_user] },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
}
