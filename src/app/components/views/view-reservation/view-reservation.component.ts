import { Component, OnInit } from '@angular/core';
import { CottageMasterService } from '../../../services/cottage-master.service';
import { ICottage } from '../../../globals/interface/cottage';
import { ActivatedRoute } from '@angular/router';
import { EMage } from 'src/app/globals/enums/image';
import { MatTableDataSource } from '@angular/material/table';
import { IColumnSchema } from 'src/app/globals/interface';
import { IBookAndCottagePayload } from 'src/app/globals/interface/book';
import { CommonServiceService } from '../../../services/common-service.service';
import { ViewReservationService } from './view-reservation.service';
import { IDBPayment } from '../../../globals/interface/book';
import { IUpdateStatus } from '../../../globals/interface/default';
import Method from '../../../utils/method';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-view-reservation',
  templateUrl: './view-reservation.component.html',
  styleUrls: ['./view-reservation.component.css']
})
export class ViewReservationComponent implements OnInit {

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
  book_details: IBookAndCottagePayload;
  sub_total!: number;
  nmbrfdys!: number;
  data_payments!: IDBPayment[];

  constructor(
    private http_cottage: CottageMasterService, 
    private activatedRoute: ActivatedRoute,
    private http_common: CommonServiceService,
    private http_vw_rsvtn: ViewReservationService,
    private method: Method,
    private snackBar: SnackBarService,
    ) {
    
    const payload: any = this.activatedRoute.snapshot.paramMap.get('payload');
      
    this.book_details = JSON.parse(atob(payload));  

    this.nmbrfdys =  this.http_common.diff_minutes(new Date(this.book_details.selected_date_to), new Date(this.book_details.selected_date_from));
  }

  ngOnInit(): void {
    this.getCottage();
    this.getPayments();
  }

  async getPayments() {
    try {
      const response = await this.http_vw_rsvtn.getPayment();
      const data = response.data as IDBPayment[];

      const dsply = data.filter((x) => (x.id === this.book_details.payment_record));
      
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

  async getCottage() {
    try {
      
      const response = await this.http_cottage.getCottage();
      const data=response.data as ICottage[];

      const cottages: number[] = JSON.parse(this.book_details.cottages as string);
      
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
      throw err;
    }
  }

  closeTab(): void {
    window.close();
  }

  async updateStatus(status: string): Promise<void> {
    try {

      const reason = (status !== 'approved') ? await this.method.customSwal({
					title: 'Please enter your reason',
					input: 'text',
					inputLabel: "",
					inputPlaceholder: ""
				}) : confirm("Are you sure to approve this reservation?");

      

      const data = {id: this.book_details.id, status, reason} as IUpdateStatus;

      const response = await this.http_vw_rsvtn.updateBookingStatus({...data});

      this.snackBar._showSnack(response.message, "success");
      
      setTimeout(() => {
        window.close();
      }, 1000);

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
