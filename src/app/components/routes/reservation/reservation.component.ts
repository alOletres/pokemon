import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { MatTableDataSource } from '@angular/material/table';
import { IBook, IBookingPayload } from '../../../globals/interface/book';
import { BookDetailsComponent } from '../../dialog/book-details/book-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

	data_allSource = new MatTableDataSource<IBook>([]);
	data_pendingSource = new MatTableDataSource<IBook>([]);
	data_approveSource =  new MatTableDataSource<IBook>([]);
	data_rejectedSource = new MatTableDataSource<IBook>([]);
	data_voidedSource = new MatTableDataSource<IBook>([]);

  constructor(private http_resservation: ReservationService, private dialog: MatDialog) {

	}


  ngOnInit(): void {
		this.getBook();
  }


	async getBook() {
		try {
			const response = await this.http_resservation.getBook();
			const data = response.data as IBook[];

			/** al booking "pending" | "approved" | "rejected" | "voided" */
			this.data_allSource.data = data;

			/** pending booking */
			const pending = [...data].filter((x) => (x.status === 'pending'));
			this.data_pendingSource.data = pending;

			/** approved booking */
			const approved = [...data].filter((x) => (x.status === 'approved'));
			this.data_approveSource.data = approved;

			/** rejected booking */
			const rejected = [...data].filter((x) => (x.status === 'rejected'));
			this.data_rejectedSource.data = rejected;

			/** voided */
			const voided = [...data].filter((x) => (x.status === 'voided'));
			this.data_voidedSource.data = voided;
			

		} catch (err) {
			throw err;
		}
	}

	openDialog(payload: IBookingPayload) {
		const dialogRef = this.dialog.open(BookDetailsComponent, {
			width: '1000px', 
			disableClose: true, 
			data: payload
		});

		dialogRef.afterClosed().subscribe(() => {
			this.ngOnInit();
		});
	}

	

}
