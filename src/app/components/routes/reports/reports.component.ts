import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { IReportPayload } from '../../../globals/interface/book';
import { IColumnSchema } from '../../../globals/interface/default';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  column_schema: IColumnSchema[] = [
    {
      key: 'firstname',
      type: "text",
      label: "customer name"
    },
    {
      key: "role",
      type: "text",
      label: "customer type"
    },
    {
      key: "selected_date_from",
      type: "date",
      label: "Selected date from"
    },
    {
      key: "selected_date_to",
      type: "date",
      label: "selected date to"
    },
    {
      key: "type",
      type: "text",
      label: "payment type"
    },
    {
      key: "numberOfDays",
      type: "text",
      label: "number of days"
    },
    {
      key: "status",
      type: "status",
      label: "status"
    },
    {
      key: "createdAt",
      type: "date",
      label: "created at"
    }
  ];

  display_column: string[] = this.column_schema.map(x => x.key);

  data_reports = new MatTableDataSource<IReportPayload>([]);
  @ViewChild("reportPaginator") reportPaginator!: MatPaginator;
  @ViewChild("reportSort") reportSort!: MatSort;

  constructor(private http_book: BookService,) { }

  ngOnInit(): void {
    this.getReports();
  }

  ngAfterViewInit(): void {
    this.data_reports.sort = this.reportSort;
    this.data_reports.paginator = this.reportPaginator;
  }

  async getReports() {
    try {
      const response = await this.http_book.getReports();
      this.data_reports.data = response.data as IReportPayload[]; 

    } catch (err) {
      throw err;
    }
  }

}
