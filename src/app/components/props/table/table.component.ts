import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IBook, IColumnSchema } from 'src/app/globals/interface';
import Method from '../../../utils/method';
import { IBookingPayload } from 'src/app/globals/interface/book';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '../../dialog/book-details/book-details.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  column_schema: IColumnSchema[] = [
    {
      key: 'complete_name',
      type: 'text',
      label: 'Complete name',
    },
    {
      key: 'email',
      type: 'text',
      label: 'Email',
    },
    {
      key: 'selected_date_from',
      type: 'date',
      label: 'selected date from',
    },

    {
      key: 'selected_date_to',
      type: 'date',
      label: 'selected date to',
    },

    {
      key: 'status',
      type: 'status',
      label: 'status',
    },
    {
      key: 'x_reason',
      type: 'reason',
      label: 'reason',
    },
    {
      key: 'type',
      type: 'type',
      label: 'type',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: 'action',
    },
  ];

  display_columns: string[] = this.column_schema.map((x) => x.key);
  @Output() eventListener = new EventEmitter<IBookingPayload>();

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  @Input() data_source = new MatTableDataSource<IBook>([]);

  constructor(private method: Method, private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.data_source.paginator = this.paginator;
    this.data_source.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data_source.filter = filterValue.trim().toLowerCase();
  }

  viewResservation(payload: IBookingPayload) {
    this.eventListener.emit(payload);
  }
}
