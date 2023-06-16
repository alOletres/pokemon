import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICottage } from 'src/app/globals/interface';
import {
  IBook,
  IBookChangesPayload,
  IBookingPayload,
} from 'src/app/globals/interface/book';
import { CottageMasterService } from 'src/app/services/cottage-master.service';
import { ModelFormGroup } from '../../../globals/interface/default';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TCottageType } from 'src/app/globals/interface/cottage';
import { BookService } from '../../../services/book.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

interface IBookUpdatePayload
  extends ICottage,
    Pick<IBookChangesPayload, 'books'>,
    Pick<IBook, 'selected_date_from' | 'selected_date_to'> {
  book_id: number;
}

interface ICottageForm
  extends Pick<IBook, 'selected_date_from' | 'selected_date_to'>,
    Pick<ICottage, 'price' | 'capacity'> {
  cottage_id: number | null;
  type: string | null;
}

@Component({
  selector: 'app-book-changes-update',
  templateUrl: './book-changes-update.component.html',
  styleUrls: ['./book-changes-update.component.css'],
})
export class BookChangesUpdateComponent implements OnInit {
  data_cottage: ICottage[] = [];
  filtered_cottages: ICottage[] = [];
  available_cottages: ICottage[] = [];
  cottage_form!: ModelFormGroup<ICottageForm>;
  cottage_type: TCottageType[] = ['floating', 'non-floating'];

  constructor(
    private dialogRef: MatDialogRef<BookChangesUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IBookUpdatePayload,
    private CottageMasterService: CottageMasterService,
    private BookService: BookService,
    private snackBar: SnackBarService
  ) {
    this.setForm(data);
  }

  async ngOnInit() {
    await Promise.resolve().then(async () => {
      await this.getCottages();
    });
  }

  setForm(data: IBookUpdatePayload) {
    this.cottage_form = new FormGroup({
      selected_date_from: new FormControl<Date | string>(
        convertDateFormat(data.selected_date_from)
      ),
      selected_date_to: new FormControl<Date | string>(
        convertDateFormat(data.selected_date_to)
      ),
      type: new FormControl<string | null>(null, Validators.required),
      cottage_id: new FormControl<number | null>(null, Validators.required),
      capacity: new FormControl(),
      price: new FormControl(),
    });
  }

  getBook() {
    const cottage_book =
      this.data.books &&
      [...this.data.books].length &&
      [...this.data.books]
        .filter((value) => {
          const selected_date_from = convertDateFormat(
            value.selected_date_from
          );
          const selected_date_to = convertDateFormat(value.selected_date_to);

          const start_date = convertDateFormat(this.data.selected_date_from);
          const end_date = convertDateFormat(this.data.selected_date_to);

          return (
            (selected_date_from >= start_date &&
              selected_date_from <= end_date) ||
            (selected_date_to >= start_date && selected_date_to <= end_date)
          );
        })
        .map((value) => value.cottages);

    const cottages: number[] = [];

    cottage_book &&
      cottage_book.length &&
      [...cottage_book].map((value) => {
        if (value && typeof value === 'string') {
          cottages.push(...JSON.parse(value));
        }
      });

    if (cottages && cottages.length) {
      const filtered_cottages = this.data_cottage.filter(
        (value) => !cottages.some((obj) => obj === value.id)
      );

      this.filtered_cottages = [...filtered_cottages];
    } else {
      this.filtered_cottages = [...this.data_cottage];
    }
  }
  async getCottages() {
    const response = await this.CottageMasterService.getCottage();
    this.data_cottage = response.data as ICottage[];

    this.getBook();
  }

  cottageTypeChange(cottage_type: TCottageType) {
    if (this.filtered_cottages && [...this.filtered_cottages].length) {
      this.available_cottages = [...this.filtered_cottages].filter(
        (value) => value.type === cottage_type
      );
    }
  }

  cottageChange(id: number) {
    if (this.available_cottages && [...this.available_cottages].length) {
      const cottage = [...this.available_cottages].find(
        (value) => value.id === id
      );
      this.cottage_form?.patchValue({
        capacity: cottage?.capacity,
        price: cottage?.price,
      });
    }
  }

  async saveChanges() {
    if (this.cottage_form?.invalid) {
      this.cottage_form.markAllAsTouched();
    } else {
      /**
       * set payload
       * save changes
       */

      try {
        const payload = {
          cottages: JSON.stringify([this.cottage_form.value.cottage_id]),
          id: this.data.book_id,
        } as IBookingPayload & Pick<ICottage, 'id'>;

        const response = await this.BookService.updateBookChanges(payload);

        this.snackBar._showSnack(response.message, 'success');
        this.dialogRef.close();
      } catch (err) {
        throw err;
      }
    }
  }
}

const convertDateFormat = (date: string | Date) =>
  moment(date).format('YYYY-MM-DD');
