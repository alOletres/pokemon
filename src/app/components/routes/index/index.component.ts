import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BookService } from '../../../services/book.service';
import { IBook, IDBPayment, IPayment } from '../../../globals/interface/book';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ILabelFormat, ILabelName } from 'src/app/globals/interface/default';
import { total_income } from '../../../utils/method';
import { IUser } from 'src/app/globals/interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
 
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4
      }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: { display: true },
    }
  };
  public barChartLabels: string[] = [] //'2006', '2007', '2008', '2009', '2010', '2011', '2012';
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    datasets: []
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  /** decleration */

  graph_lbl_lst: string[] = ["days", "month", "year"];
  graph_lbl_name: ILabelName = "year";
  
  current_date = new Date();
  data_reports!: (IUser & IBook & IPayment)[];
  total_income: number = 0;

  
  constructor(private http_book: BookService,) { }

  async ngOnInit(): Promise<void> {
    await this.getReports();
    this.graphLabelEvent();
  }

  setLineGraph(): void {
    this.barChartType = "line";
  }

  setBarGraph(): void {
    this.barChartType = "bar";
  }

  async getReports() {
    try {
      const response = await this.http_book.getReports();
      const data = response.data as (IUser & IBook & IPayment)[];
      this.data_reports = [...data].filter((values) => (values.status === 'approved'));
      this.total_income = total_income([...this.data_reports]);
    } catch (err) {
      throw err;
    }
  }

  graphLabelEvent() {
    const date_format: ILabelFormat = this.graph_lbl_name === "month" 
      ? "MMM YYYY" 
      : this.graph_lbl_name === "days" 
      ? "dddd Do yyyy" 
      : "YYYY";

    const label: string[] = [];

    let startDay = 1

    while (startDay <= 7) {
      const date_result = moment(this.current_date).subtract(startDay, this.graph_lbl_name);
      label.push(date_result.format(date_format));
      
      startDay++;
    }

    const payload = this.data_reports;

    this.barChartData = {
      labels: [...label],
      datasets: [
        { 
          data: 
            calculateDataSets({label, payload, status: '"online"', date_format}), 
          label: 'Online' 
        },
        { 
          data: 
            calculateDataSets({label, payload, status: '"walkin"', date_format}),
          label: 'Walkin' 
        }
      ]
    }
    
  }

}

export interface ICalculateDataSets {
  label: string[];
  payload: (IUser & IBook & IPayment)[];
  status: '"online"' | '"walkin"',
  date_format: ILabelFormat
}

const calculateDataSets = ({
  label,
  payload,
  status,
  date_format
}: ICalculateDataSets): number[] => {
  let total: number = 0;

  const total_handler: number[] = [];

  label.map((lbl) => {
    const result = payload.filter((values) => (

      moment(values.createdAt).format(date_format) === lbl 
      && 
      values.type === status

    )).map((x) => {

      total += x.amount;
      return total;
    });

    if(result.length === 0) {
      total_handler.push(0);
    } else {
      total_handler.push(...result);
    }

    
  });

  return total_handler;

}