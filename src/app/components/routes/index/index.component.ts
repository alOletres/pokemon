import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BookService } from '../../../services/book.service';
import { IBook, IPayment } from '../../../globals/interface/book';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ILabelFormat, ILabelName } from 'src/app/globals/interface/default';
import { total_income } from '../../../utils/method';
import { IUser } from 'src/app/globals/interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  /** income statistics declarations */
  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4,
      },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };
  public barChartLabels: string[] = []; //'2006', '2007', '2008', '2009', '2010', '2011', '2012';
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    datasets: [],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    // console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    // console.log(event, active);
  }

  public graph_lbl_lst: string[] = ['days', 'month', 'year'];
  public graph_lbl_name: ILabelName = 'year';
  public current_date = new Date();
  public data_reports!: (IUser & IBook & IPayment)[];
  public total_income: string = '';

  /** trend analysis declaration */
  public barChartOptionsTrend: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4,
      },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };
  public barChartLabelsTrend: string[] = []; //'2006', '2007', '2008', '2009', '2010', '2011', '2012';
  public barChartTypeTrend: ChartType = 'pie';

  public barChartDataTrend: ChartData<'bar'> = {
    datasets: [],
  };
  public graph_lbl_trend: string[] = [...this.graph_lbl_lst];
  public label_default_trend: ILabelName = 'year';
  public data_trend!: string;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },

      // datalabels: {

      //   formatter: (value: any, ctx: any) => {
      //     if (ctx.chart.data.labels) {
      //       return ctx.chart.data.labels[ctx.dataIndex];
      //     }
      //   },
      // } ,
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [],
  };
  public pieChartType: ChartType = 'pie';

  data_book_list: (IUser & IBook & IPayment)[] = [];

  constructor(private http_book: BookService) {}

  async ngOnInit(): Promise<void> {
    await this.getReports();
    await Promise.resolve().then(() => {
      this.graphLabelIncome();
      this.graphLabelAnalysis();
      this.rejectGraphData();
    });
  }

  async getReports() {
    try {
      const response = await this.http_book.getReports();
      const data = response.data as (IUser & IBook & IPayment)[];
      this.data_book_list = data;
      this.data_reports = [...data].filter(
        (values) => values.status === 'approved'
      );

      this.total_income = total_income([...this.data_reports]);
    } catch (err) {
      throw err;
    }
  }

  graphLabelAnalysis() {
    const result = calculateLabel(this.label_default_trend);
    const label = result.label;
    const date_format = result.date_format;
    const payload = [...this.data_reports];

    this.barChartDataTrend = {
      labels: [...label],
      datasets: [
        {
          data: calculatePeakSeason({
            label,
            payload,
            status: '"online"',
            date_format,
          }),
          label: 'Peak season',
        },
        {
          data: calculateLeanSeason({
            label,
            payload,
            status: '"online"',
            date_format,
          }),
          label: 'Lean season',
        },
      ],
    };
  }

  graphLabelIncome() {
    const result = calculateLabel(this.graph_lbl_name);
    const label = result.label;
    const date_format = result.date_format;
    const payload = [...this.data_reports];

    this.barChartData = {
      labels: [...label],
      datasets: [
        {
          data: calculateDataSets({
            label,
            payload,
            status: '"online"',
            date_format,
          }),
          label: 'Online',
        },
        {
          data: calculateDataSets({
            label,
            payload,
            status: '"walkin"',
            date_format,
          }),
          label: 'Walkin',
        },
      ],
    };
  }

  /**
   * reject
   */

  rejectGraphData() {
    const data_result = [...this.data_book_list].filter(
      (value) => value.status === 'rejected'
    );

    this.pieChartData = {
      labels: ['Reject'],
      datasets: [
        {
          data: [data_result.length],
        },
      ],
    };
  }
}

export interface ICalculateDataSets {
  label: string[];
  payload: (IUser & IBook & IPayment)[];
  status: '"online"' | '"walkin"';
  date_format: ILabelFormat;
}

const calculatePeakSeason = ({
  label,
  payload,
  status,
  date_format,
}: ICalculateDataSets) => {
  /**
   * 2018
   * total income divide by current year from the start of company
   */

  const constantValue: number =
    date_format === 'YYYY' ? 500 : date_format === 'MMM YYYY' ? 300 : 150;

  const peakSeasonArray: number[] = [];

  label.map((lbl) => {
    const result = [...payload].filter((value) => {
      const compareDate = moment(value.selected_date_from).format(date_format);

      return compareDate === lbl;
    });

    /**
     * constant value greater than result or equal is peakseason
     */

    if (result.length >= constantValue) {
      peakSeasonArray.push(result.length);
    } else {
      peakSeasonArray.push(0);
    }
  });

  return [...peakSeasonArray];
};

const calculateLeanSeason = ({
  label,
  payload,
  status,
  date_format,
}: ICalculateDataSets) => {
  /**
   * 2018
   * total income divide by current year from the start of company
   */

  const constantValue: number =
    date_format === 'YYYY' ? 500 : date_format === 'MMM YYYY' ? 300 : 10;

  const leanSeasonArray: number[] = [];

  label.map((lbl) => {
    const result = payload.filter(
      (value) => moment(value.selected_date_from).format(date_format) === lbl
    );

    /**
     * if equal or below 30 is lean season
     */

    if (result.length <= constantValue) {
      leanSeasonArray.push(result.length);
    } else {
      /**
       * else peak season
       */

      leanSeasonArray.push(0);
    }
  });

  return leanSeasonArray;
};

const calculateDataSets = ({
  label,
  payload,
  status,
  date_format,
}: ICalculateDataSets): number[] => {
  const totalHolder = label.map((lbl) => {
    let total: number = 0;
    const total_handler: number[] = [];
    const result = payload
      .filter((values) => {
        return (
          moment(values.selected_date_from).format(date_format) === lbl &&
          values.type === status
        );
      })
      .map((x) => {
        total += x.amount;
        return total;
      });

    if (result.length !== 0) return total_handler.push(...result);
    else return total_handler.push(0);
  });

  return totalHolder;
};

const calculateLabel = (labelName: ILabelName) => {
  const date_format: ILabelFormat =
    labelName === 'month'
      ? 'MMM YYYY'
      : labelName === 'days'
      ? 'dddd Do yyyy'
      : 'YYYY';

  const label: string[] = [];

  let startDay = 0;

  while (startDay <= 7) {
    const date_result = moment(new Date()).subtract(startDay, labelName);
    label.push(date_result.format(date_format));

    startDay++;
  }

  return {
    date_format,
    label,
  };
};
