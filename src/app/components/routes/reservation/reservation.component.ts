import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  IBook,
  IBookAndCottagePayload,
  IBookingPayload,
} from '../../../globals/interface/book';
import { BookDetailsComponent } from '../../dialog/book-details/book-details.component';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../services/book.service';
import { UserMasterService } from '../../../services/user-master.service';
import { IUser } from '../../../globals/interface/payload';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  data_allSource = new MatTableDataSource<IBook>([]);
  data_pendingSource = new MatTableDataSource<IBook>([]);
  data_approveSource = new MatTableDataSource<IBook>([]);
  data_rejectedSource = new MatTableDataSource<IBook>([]);
  data_voidedSource = new MatTableDataSource<IBook>([]);

  data_user!: IUser[];

  constructor(
    private http_book: BookService,
    private dialog: MatDialog,
    private http_user: UserMasterService
  ) {}

  ngOnInit(): void {
    this.getBook();
    this.getUser();
  }

  async getBook() {
    try {
      const response = await this.http_book.getBook();
      const data = response.data as IBook[];

      const source_data = data.map((value) => {
        value.complete_name = `${value.firstname} ${value.lastname}`;
        return value;
      });

      /** al booking "pending" | "approved" | "rejected" | "voided" */
      this.data_allSource.data = source_data;

      /** pending booking */
      const pending = [...source_data].filter((x) => x.status === 'pending');
      this.data_pendingSource.data = pending;

      /** approved booking */
      const approved = [...source_data].filter((x) => x.status === 'approved');
      this.data_approveSource.data = approved;

      /** rejected booking */
      const rejected = [...source_data].filter((x) => x.status === 'rejected');
      this.data_rejectedSource.data = rejected;

      /** voided */
      const voided = [...source_data].filter((x) => x.status === 'voided');
      this.data_voidedSource.data = voided;
    } catch (err) {
      throw err;
    }
  }

  async getUser(): Promise<void> {
    try {
      const response = await this.http_user.getUser();
      const data = response.data as IUser[];
      this.data_user = data;
    } catch (err) {
      throw err;
    }
  }

  openDialog(payload: IBookingPayload) {
    const element = payload as IBookAndCottagePayload;

    const user = [...this.data_user].filter((x) => x.id === element.booker);

    const dialogRef = this.dialog.open(BookDetailsComponent, {
      width: '1000px',
      disableClose: true,
      data: { payload, user },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
}
