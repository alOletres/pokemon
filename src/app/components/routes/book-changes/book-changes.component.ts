import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IBook, ICottage } from 'src/app/globals/interface';
import { IBookingPayload } from 'src/app/globals/interface/book';
import { BookService } from 'src/app/services/book.service';
import { BookChangesDialogComponent } from '../../dialog/book-changes-dialog/book-changes-dialog.component';
import { CottageMasterService } from 'src/app/services/cottage-master.service';
import { EMage } from 'src/app/globals/enums/image';

@Component({
  selector: 'app-book-changes',
  templateUrl: './book-changes.component.html',
  styleUrls: ['./book-changes.component.css'],
})
export class BookChangesComponent implements OnInit {
  book_approve = new MatTableDataSource<IBook>([]);
  book_pending = new MatTableDataSource<IBook>([]);

  data_cottage: ICottage[] = [];

  constructor(
    private BookService: BookService,
    private dialog: MatDialog,
    private CottageMasterService: CottageMasterService
  ) {}

  ngOnInit(): void {
    this.getBook();
    this.getCottage();
  }

  async getBook() {
    const response = await this.BookService.getBook();
    const data = response.data as IBook[];

    this.book_approve.data = [...data]
      .filter((value) => value.status === 'approved')
      .map((value) => {
        value.complete_name = `${value.firstname} ${value.lastname}`;
        return value;
      });
  }

  async getCottage() {
    const response = await this.CottageMasterService.getCottage();
    const data = response.data as ICottage[];

    this.data_cottage = data;
  }

  viewResservation(data: IBookingPayload) {
    const cottages: number[] = JSON.parse(data.cottages as string);

    const cottage_array: ICottage[] = [];

    [...cottages].forEach((x) => {
      const cottage_list = this.data_cottage.filter((z) => z.id === x);
      if (cottage_list.length > 0) {
        cottage_array.push(...cottage_list);
      }
    });

    const list = cottage_array.map((x) => {
      x.images = `${EMage.BASE64_INITIAL},${x.images?.[0]}`;
      return x;
    });

    const dialogRef = this.dialog.open(BookChangesDialogComponent, {
      data: { ...data, cottages: list, books: [...this.book_approve.data] },
      disableClose: true,
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
}
