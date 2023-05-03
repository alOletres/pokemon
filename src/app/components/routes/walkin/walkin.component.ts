import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ECOTTAGE_TYPE } from '../../../globals/enums/default';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { CottageMasterService } from '../../../services/cottage-master.service';
import { ErrorResponse } from '../../../utils/server-response';
import { ICottage } from '../../../globals/interface/cottage';
import { CommonServiceService } from '../../../services/common-service.service';
import { StoreService } from '../../../store/service/store.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/model/appState.model';
import { EMage } from '../../../globals/enums/image';
import Method, { mergeArray } from '../../../utils/method';
import {
  IBook,
  IBookAndCottagePayload,
  IBookingPayload,
  IPayment,
  TProps,
} from '../../../globals/interface/book';
import { MatStepper } from '@angular/material/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { BookService } from '../../../services/book.service';
import { IUser } from 'src/app/globals/interface';
import * as moment from 'moment';

@Component({
  selector: 'app-walkin',
  templateUrl: './walkin.component.html',
  styleUrls: ['./walkin.component.css'],
})
export class WalkinComponent implements OnInit {
  isEditable = false;
  reservationForm!: FormGroup;
  userForm!: FormGroup;
  cottageType: string[] = [ECOTTAGE_TYPE.FLOATING, ECOTTAGE_TYPE.NON_FLOATING];
  base64 = EMage.BASE64_INITIAL;
  dataCottage!: ICottage[];
  cottageAddedList!: IBookAndCottagePayload[];
  cottageList!: ICottage[];
  selectedCottage!: ICottage;
  btnName = 'Add Cottage';
  total: number = 0;
  totalDays: number = 0;

  min_date = new Date();

  data_book_list: (IBook & IUser & IPayment)[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: SnackBarService,
    private http_cottage: CottageMasterService,
    private common: CommonServiceService,
    private store_method: StoreService,
    private store: Store<AppState>,
    private method: Method,
    private http_book: BookService
  ) {
    this.reservationForm = fb.group({
      selected_date_from: [null, Validators.required],
      selected_date_to: [null, Validators.required],
      type: [null, Validators.required],
      cottage_number: [null, Validators.required],
      isCottage: [null, Validators.required],
      id: null,
      images: null,
      price: null,
      is_available: null,
      capacity: null,
      description: null,
      payment_type: 'cash',
    });

    this.userForm = fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, Validators.required],
      mobile_number: [null, Validators.required],
      address: [null, Validators.required],
      comment: null,
      password: null,
      roles: JSON.stringify(['customer']),
    });
  }

  get selected_date_from() {
    return this.reservationForm.get('selected_date_from');
  }

  get selected_date_to() {
    return this.reservationForm.get('selected_date_to');
  }

  get type() {
    return this.reservationForm.get('type');
  }

  get cottage_number() {
    return this.reservationForm.get('cottage_number');
  }

  ngOnInit(): void {
    this.getCottage();
    this.getCottageBook();
    this.getBook();
  }

  getCottageBook() {
    this.store.select('cottage').subscribe((data): void => {
      try {
        this.cottageAddedList = Object.values(data);
        this.total = totalAmount(this.cottageAddedList);

        this.reservationForm.patchValue({
          type: this.cottageAddedList[0].type,
          cottage_number: this.cottageAddedList[0].cottage_number,
          isCottage: this.cottageAddedList[0].isCottage,
        });

        this.selected_date_from?.disable();
        this.selected_date_to?.disable();

        this.totalDays = this.common.diff_minutes(
          new Date(this.cottageAddedList[0].selected_date_to),
          new Date(this.cottageAddedList[0].selected_date_from)
        );
      } catch (err) {
        return undefined;
      }
    });
  }

  async getCottage(): Promise<void> {
    try {
      const response = await this.http_cottage.getCottage();
      this.dataCottage = response.data as ICottage[];
    } catch (err) {
      throw err;
    }
  }

  async getBook() {
    const response = await this.http_book.getBook();
    const data = response.data as (IBook & IUser & IPayment)[];
    this.data_book_list = data;
  }

  changeCottageType(event: string) {
    /**
     * @trap for available cottage only in specific date
     */
    const cottagesList = [...this.dataCottage].filter((x) => x.type === event);
    const cottagesListDb: number[] = [];
    /**
     * selected date
     */

    const frontFrom = moment(
      this.reservationForm.get('selected_date_from')?.value
    ).format('YYYY-MM-DD');
    const frontTo = moment(
      this.reservationForm.get('selected_date_to')?.value
    ).format('YYYY-MM-DD');

    /**
     * @check date and get the cottage number
     */

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
      const notEqualValues = cottagesList.filter(
        (value) => !cottagesListDb.some((obj) => obj === value.id)
      );

      this.cottageList = notEqualValues;
    } else {
      this.cottageList = cottagesList;
    }
  }

  changeCottageNumber(event: string) {
    const data = [...this.cottageList].filter(
      (x) => x.cottage_number === event
    );
    this.selectedCottage = data[0];
  }

  addCottage(): void {
    /**
     * step 1 patchvalue of is cottage to make sure the user click the button
     */
    this.reservationForm.patchValue({ isCottage: true });

    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
    } else {
      if (this.btnName === 'Add Cottage') {
        const data = [this.reservationForm.value] as IBookAndCottagePayload[];

        const newArr = data.map((x) => {
          x.id = this.selectedCottage.id as number;
          x.images = this.selectedCottage.images;
          (x.price = this.selectedCottage.price),
            (x.is_available = this.selectedCottage.is_available);
          x.capacity = this.selectedCottage.capacity;
          x.description = this.selectedCottage.description;
          x.selected_date_from = new Date(
            this.reservationForm.get('selected_date_from')?.value
          );
          x.selected_date_to = new Date(
            this.reservationForm.get('selected_date_to')?.value
          );

          return x;
        });

        this.store_method.addToCottage(newArr[0]);

        this.snackBar._showSnack('Cottage Successfully added', 'success');
        this.ngOnInit();
      } else {
        location.reload();
      }
    }
  }

  deleteCottage(id: number) {
    this.store_method.deleteCottage(id);
    this.snackBar._showSnack('Cottage Successfully deleted!', 'success');

    if (this.cottageAddedList.length === 0) {
      this.reservationForm.patchValue({ isCottage: null });
    } else {
      this.selected_date_from?.patchValue(
        new Date(this.cottageAddedList[0].selected_date_from)
      );

      this.selected_date_to?.patchValue(
        new Date(this.cottageAddedList[0].selected_date_to)
      );
    }
    this.ngOnInit();
  }

  async submitBook(stepper: MatStepper): Promise<void> {
    try {
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
      } else {
        const psswrd = await this.method.customSwal({
          title: 'Create your own password',
          input: 'text',
          inputLabel: 'Enter your password',
          inputPlaceholder: '',
        });

        this.userForm.get('password')?.patchValue(psswrd);

        const cottages = this.cottageAddedList.map((x) => x.id);

        const list = this.cottageAddedList[0];

        const dates = {
          from: list.selected_date_from,
          to: list.selected_date_to,
        };

        const user = { ...this.userForm.value };

        const other =
          'comment' in user && user['comment'] ? { comment: user.comment } : {};

        if ('comment' in user) {
          delete user['comment'];
        }

        const type: string = 'walkin';

        const payment = {
          amount: this.total * this.totalDays,
          payment_type: 'cash',
        };

        const payload = {
          cottages,
          dates,
          other,
          user,
          payment,
          type,
        };

        const formData = new FormData();

        for (const item of Object.keys(payload)) {
          let props: TProps = item as TProps;
          const value: string = payload[props] as unknown as string;
          formData.append(props, JSON.stringify(value));
        }

        const response = await this.http_book.bookCottage(formData);

        this.snackBar._showSnack(response.message, 'success');

        this.cottageAddedList.length = 0;

        stepper.next();

        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (Err) {
      const error = ErrorResponse(Err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, 'error');
    }
  }

  nextStepper(stepper: MatStepper) {
    try {
      if (!this.reservationForm.get('isCottage')?.value)
        throw new HttpErrorResponse({
          error: 'Please select cottage first',
          status: 500,
        });

      stepper.next();
    } catch (err) {
      throw err;
    }
  }

  dateSearchChange(event: any) {
    console.log(event);
  }
}

const totalAmount = (data: IBookAndCottagePayload[]): number => {
  let total = 0;
  data.forEach((x) => (total += x.price));

  return total;
};
