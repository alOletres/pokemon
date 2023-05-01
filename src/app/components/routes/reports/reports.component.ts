import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { IReportPayload, IBook } from '../../../globals/interface/book';
import { IColumnSchema } from '../../../globals/interface/default';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonServiceService } from '../../../services/common-service.service';
import { PdfmakeService } from '../../../services/pdfmake.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  column_schema: IColumnSchema[] = [
    {
      key: 'firstname',
      type: 'text',
      label: 'customer name',
    },
    {
      key: 'role',
      type: 'text',
      label: 'customer type',
    },
    {
      key: 'selected_date_from',
      type: 'date',
      label: 'Selected date from',
    },
    {
      key: 'selected_date_to',
      type: 'date',
      label: 'selected date to',
    },
    {
      key: 'type',
      type: 'text',
      label: 'payment type',
    },
    {
      key: 'number_of_days',
      type: 'number_of_days',
      label: 'number of days',
    },
    {
      key: 'amount',
      type: 'amount',
      label: 'Amount',
    },
    {
      key: 'total_amount',
      type: 'total_amount',
      label: 'Total amount',
    },
    {
      key: 'status',
      type: 'status',
      label: 'status',
    },
    // {
    //   key: 'createdAt',
    //   type: 'date',
    //   label: 'created at',
    // },
  ];

  display_column: string[] = this.column_schema.map((x) => x.key);

  data_reports = new MatTableDataSource<IReportPayload>([]);
  @ViewChild('reportPaginator') reportPaginator!: MatPaginator;
  @ViewChild('reportSort') reportSort!: MatSort;

  dateRangeForm!: FormGroup;
  report_length: number = 0;
  display_total: number = 0;

  constructor(
    private http_book: BookService,
    private fb: FormBuilder,
    private common: CommonServiceService,
    private pdfmake: PdfmakeService
  ) {
    this.dateRangeForm = fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getReports();
  }

  ngAfterViewInit(): void {
    this.data_reports.sort = this.reportSort;
    this.data_reports.paginator = this.reportPaginator;
  }

  async appFilterDate() {
    const startDate = this.dateRangeForm.get('startDate')?.value;
    const endDate = this.dateRangeForm.get('endDate')?.value;

    const momentSdate = moment(startDate).format('YYYY-MM-DD');
    const momentEdate = moment(endDate).format('YYYY-MM-DD');

    await this.getReports();

    this.data_reports.data = this.data_reports.data.filter(
      (x: IBook) =>
        moment(x.selected_date_from).format('YYYY-MM-DD') >= momentSdate &&
        moment(x.selected_date_from).format('YYYY-MM-DD') <= momentEdate
    );

    this.report_length = this.data_reports.data.length;
    this.display_total = this.total_amount(this.data_reports.data);
  }

  async getReports() {
    try {
      const response = await this.http_book.getReports();

      const data: any[] = response.data as IReportPayload[];

      const result = data
        .filter((a: any) => a.status === 'approved')
        .map((x) => {
          x.number_of_days = this.common.diff_minutes(
            new Date(x.selected_date_to),
            new Date(x.selected_date_from)
          );
          x.total_amount = x.amount * x.number_of_days;
          return x;
        });

      this.data_reports.data = result as never[];
      this.report_length = this.data_reports.data.length;

      this.display_total = this.total_amount(this.data_reports.data);
    } catch (err) {
      throw err;
    }
  }

  printReport() {
    this.pdfmake.generate(this.dateRangeForm.value, this.data_reports.data);
  }

  total_amount(payload: any[]): number {
    let total = 0;
    [...payload].map((x) => {
      total += x.total_amount;
    });

    return total;
  }
}
