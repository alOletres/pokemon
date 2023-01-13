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
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/model/appState.model';
import { IUser } from '../../../globals/interface/payload';
import { UserService } from '../../wrapper/user/user.service';
import { UserMasterService } from '../../../services/user-master.service';
import * as moment from 'moment';

interface IPayload_Dialog {
  payload: IBookAndCottagePayload;
  user: IUser[];
}

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
  data_payments!: IDBPayment[];
  // book_details!: IBookAndCottagePayload;
  sub_total!: number;
  nmbrfdys!: number;
  user!: IUser[];

  user_role!: string;
  data!: IBookAndCottagePayload;

  current_date = new Date();
  booleanRejected: boolean = false; 
  
  constructor(
    public dialogRef: MatDialogRef<BookDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public payload: IPayload_Dialog,
    private http_cottage: CottageMasterService, 
    private http_common: CommonServiceService,
		private http_book: BookService,
    private snackBar: SnackBarService,
		private method: Method,
		private http_payment: PaymentService,
    private store: Store<AppState>,
    private http_user: UserMasterService,
		
  ) { 

    this.data = payload.payload;

    this.store.select("user").subscribe((data): void => {
      try {
        this.user = data;

      } catch (err) {
        return undefined
      }
    })
    this.nmbrfdys =  this.http_common.diff_minutes(new Date(this.data.selected_date_to), new Date(this.data.selected_date_from));
    
  }

  ngOnInit() {
		Promise.resolve().then(() => {
			this.getCottage();
			this.getPayments();
      this.getUser();
		});
      
  }

  async getUser(): Promise<void> {
    try {
      const response = await this.http_user.getUser();
      const data = response.data as IUser[];
      const result = data.filter((x) => (x.id === this.user[0].id));
      const user_data = result.map((x) => {
        x.role = JSON.parse(x.role as string);
        return x;
      });

      this.user_role = user_data[0].role?.[0];

      const created_at = moment(this.data.createdAt).add(4, "hours").format("LLL");

      const current = moment(this.current_date).format("LLL");

      if(this.user_role === "customer") {
        
         this.booleanRejected = created_at > current ? false : true;
      }

     
    } catch (err) {
      const error = ErrorResponse(err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
    }
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

      this.sub_total = this.method.sub_total([...list]);

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

