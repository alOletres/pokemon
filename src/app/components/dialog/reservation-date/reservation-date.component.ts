import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../../store/service/store.service';
import {
  IBook,
  IBookAndCottagePayload,
  IPayment,
} from '../../../globals/interface/book';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/model/appState.model';
import { IUser } from '../../../globals/interface/payload';
import { BookService } from '../../../services/book.service';
import * as moment from 'moment';
import { mergeArray } from 'src/app/utils/method';

@Component({
  selector: 'app-reservation-date',
  templateUrl: './reservation-date.component.html',
  styleUrls: ['./reservation-date.component.css'],
})
export class ReservationDateComponent implements OnInit {
  dateForm!: FormGroup;
  minDate = new Date();
  dataBook!: IBookAndCottagePayload[];
  data_booked!: IBook[];
  user!: IUser;
  data_book_list: (IBook & IUser & IPayment)[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReservationDateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IBookAndCottagePayload,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private store_method: StoreService,
    private snackBar: SnackBarService,
    private store: Store<AppState>,
    private http_book: BookService
  ) {
    store.select('cottage').subscribe((data): void => {
      try {
        this.dataBook = data;
      } catch (err) {
        return undefined;
      }
    });

    store.select('user').subscribe((data): void => {
      try {
        this.user = data[0];
      } catch (err) {
        return undefined;
      }
    });
  }

  get selected_date_from() {
    return this.dateForm.get('selected_date_from');
  }

  get selected_date_to() {
    return this.dateForm.get('selected_date_to');
  }

  ngOnInit(): void {
    if (this.dataBook.length > 0) {
      this.dateForm = this.fb.group({
        selected_date_from: [
          {
            disabled: true,
            value: new Date(this.dataBook[0].selected_date_from),
          },
          Validators.required,
        ],
        selected_date_to: [
          {
            disabled: true,
            value: new Date(this.dataBook[0].selected_date_to),
          },
          Validators.required,
        ],
      });
    } else {
      this.dateForm = this.fb.group({
        selected_date_from: [null, Validators.required],
        selected_date_to: [null, Validators.required],
      });
    }

    Promise.resolve().then(() => this.getBook());
  }

  async getBook() {
    try {
      const response = await this.http_book.getBook();
      const data = response.data as (IBook & IUser & IPayment)[];
      this.data_book_list = data;
    } catch (err) {
      throw err;
    }
  }

  fillOutInfo(): void {
    if (this.dateForm.invalid) {
      this.dateForm.markAllAsTouched();
    } else {
      this.dialogRef.close();
      this.router.navigate(['/book']);
    }
  }

  reservedCottage(): void {
    if (this.dateForm.invalid) {
      this.dateForm.markAllAsTouched();
    } else {
      this.dialogRef.close();
      const isExist = this.checkAvailableCottage();

      if (isExist) {
        const data = [this.data];

        const newArr = data.map((x) => {
          x.payment_type = 'gcash';
          (x.selected_date_from = this.selected_date_from?.value),
            (x.selected_date_to = this.selected_date_to?.value);
          return x;
        });

        this.store_method.addToCottage(newArr[0]);

        this.snackBar._showSnack(
          'Cottage Successfully Added temporarily!',
          'success'
        );
        this.router.navigate(['/book']);
      } else {
        this.snackBar._showSnack(
          'This cottage is already taken in the same date!',
          'error'
        );
      }
    }
  }

  checkAvailableCottage() {
    const frontFrom = moment(
      this.dateForm.get('selected_date_from')?.value
    ).format('YYYY-MM-DD');
    const frontTo = moment(this.dateForm.get('selected_date_to')?.value).format(
      'YYYY-MM-DD'
    );

    const cottagesListDb: number[] = [];

    const checkCottages = [...this.data_book_list]
      .filter((value) => {
        const dbfrom = moment(value.selected_date_from).format('YYYY-MM-DD');
        const dbto = moment(value.selected_date_to).format('YYYY-MM-DD');

        const condition =
          frontFrom === dbfrom ||
          frontFrom === dbto ||
          frontTo === dbfrom ||
          frontTo === dbfrom ||
          frontTo === dbto;

        return condition;
      })
      .map((value) => value.cottages);

    if (checkCottages && checkCottages.length) {
      const distractedCottages = checkCottages.map((value) => {
        if (value && typeof value === 'string') {
          value = JSON.parse(value);
        }
        return value;
      });
      const array = mergeArray(distractedCottages);

      cottagesListDb.push(...array);
    }

    if (cottagesListDb && cottagesListDb.length) {
      const cottages = cottagesListDb.find((value) => value === this.data.id);

      const isExist = cottages ? false : true;
      return isExist;
    } else {
      return true;
    }
  }
}
