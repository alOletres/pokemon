import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IColumnSchema, ICottage } from 'src/app/globals/interface';
import { IBookAndCottagePayload, IBookingPayload, IDBPayment } from 'src/app/globals/interface/book';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { CottageMasterService } from 'src/app/services/cottage-master.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import Method from 'src/app/utils/method';
import { ErrorResponse } from '../../../utils/server-response';
import { EMage } from 'src/app/globals/enums/image';
import { BookService } from '../../../services/book.service';
import { IUpdateStatus } from 'src/app/globals/interface/default';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  column_schema: IColumnSchema[] = [
		{
			key: "images",
			type: "images",
			label: "image"
		},
		{
			key: "type",
			type: "type",
			label: "cottage type"
		},
		{
			key: "cottage_number",
			type: "text",
			label: "cottage number"
		},
		{
			key: "capacity",
			type: "text",
			label: "capacity"
		},
		{
			key: "description",
			type: "desc",
			label: "description"
		},
		{
			key: "price",
			type: "price",
			label: "price"
		}
	];

  display_column: string[] = this.column_schema.map((x) => (x.key));

  data_cottage = new MatTableDataSource<ICottage>([]);
  // book_details!: IBookAndCottagePayload;
  sub_total!: number;
  nmbrfdys!: number;
  data_payments!: IDBPayment[];
  
  constructor(
    public dialogRef: MatDialogRef<BookDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IBookAndCottagePayload,
    private http_cottage: CottageMasterService, 
    private http_common: CommonServiceService,
		private http_book: BookService,
    private snackBar: SnackBarService,
		private method: Method,
		private http_payment: PaymentService,
		
  ) { 
    this.nmbrfdys =  this.http_common.diff_minutes(new Date(this.data.selected_date_to), new Date(this.data.selected_date_from));
    
  }

  ngOnInit() {
		Promise.resolve().then(() => {
			this.getCottage();
			this.getPayments();
		});
  }

	async getCottage(): Promise<void> {
		try {
			const response = await this.http_cottage.getCottage();
			const data = response.data as ICottage[];

			const cottages: number[] = JSON.parse(this.data.cottages as string);
      
      const cottage_array: ICottage[] = [];
      
      [...cottages].forEach((x) => {
        const cottage_list = data.filter((z) => (z.id === x));
        if(cottage_list.length > 0) {
          cottage_array.push(...cottage_list);
        }
      });

      const list = cottage_array.map((x) => {
        x.images = `${EMage.BASE64_INITIAL},${x.images?.[0]}`;
        return x;
      });
      
      this.data_cottage.data = list;

      this.sub_total = sub_total([...list]);

		} catch (err) {
			const error = ErrorResponse(err);
			this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
		}
	}

	 async getPayments() {
    try {
      const response = await this.http_payment.getPayment();
      const data = response.data as IDBPayment[];

      const dsply = data.filter((x) => (x.id === this.data.payment_record));
      
      const new_arr = dsply.map((x) => {
        const img = `${EMage.BASE64_INITIAL},${x.receipt?.[0]}`;
        x.receipt = img;
        return x;
      });
      
      this.data_payments = new_arr;
      
    } catch (err) {
      throw err;
    }
  }

	async updateStatus(status: string): Promise<void> {
    try {

      const reason = (status !== 'approved') ? await this.method.customSwal({
					title: 'Please enter your reason',
					input: 'text',
					inputLabel: "",
					inputPlaceholder: ""
				}) : confirm("Are you sure to approve this reservation?");

      const data = {id: this.data.id, status, reason} as IUpdateStatus;

      const response = await this.http_book.updateBookingStatus({...data});

      this.snackBar._showSnack(response.message, "success");
      
			this.dialogRef.close();
			
    } catch (err) {
      throw err;
    }
  }

}

const sub_total = (data: ICottage[]): number => {
  let total = 0;
  data.forEach((x) => {
    total += x.price;
  });
  return total;
}
