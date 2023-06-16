import { Component, OnInit, Optional, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IColumnSchema, ICottage } from 'src/app/globals/interface';
import {
  IBook,
  IBookChangesPayload,
  IBookingPayload,
} from 'src/app/globals/interface/book';
import { BookChangesUpdateComponent } from '../book-changes-update/book-changes-update.component';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-book-changes-dialog',
  templateUrl: './book-changes-dialog.component.html',
  styleUrls: ['./book-changes-dialog.component.css'],
})
export class BookChangesDialogComponent implements OnInit {
  column_schema: IColumnSchema[] = [
    {
      key: 'images',
      type: 'images',
      label: 'image',
    },
    {
      key: 'type',
      type: 'type',
      label: 'cottage type',
    },
    {
      key: 'cottage_number',
      type: 'text',
      label: 'cottage number',
    },
    {
      key: 'capacity',
      type: 'text',
      label: 'capacity',
    },
    {
      key: 'description',
      type: 'desc',
      label: 'description',
    },
    {
      key: 'price',
      type: 'price',
      label: 'price',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: 'Action',
    },
  ];

  display_column: string[] = this.column_schema.map((x) => x.key);

  data_cottages = new MatTableDataSource<ICottage>([]);
  constructor(
    private dialogRef: MatDialogRef<BookChangesDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IBookChangesPayload,
    private dialog: MatDialog,
    private snackBar: SnackBarService
  ) {
    this.data_cottages.data = [...data.cottages];
  }

  ngOnInit(): void {}

  vieCottage(data: ICottage) {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const selectedDate = moment(this.data.selected_date_to).format(
      'YYYY-MM-DD'
    );

    // selectedDate <= currentDate
    if (false) {
      this.snackBar._showSnack(
        'Unable to update this cottage reservation',
        'error'
      );
    } else {
      const dialogRef = this.dialog.open(BookChangesUpdateComponent, {
        data: {
          ...data,
          books: [...this.data.books],
          selected_date_to: this.data.selected_date_to,
          selected_date_from: this.data.selected_date_from,
          book_id: this.data.id,
        },
        disableClose: true,
        width: '400px',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}
