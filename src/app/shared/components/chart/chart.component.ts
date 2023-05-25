import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() groupButton: boolean = true;

  @Input() chartName: string = '';

  @Input() public barChartOptions: ChartConfiguration['options'] = {
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
  @Input() public barChartLabels: string[] = []; //'2006', '2007', '2008', '2009', '2010', '2011', '2012';
  @Input() public barChartType: ChartType = 'bar';

  @Input() public barChartData: ChartData<'bar'> = {
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
  constructor() {}

  ngOnInit(): void {}

  setLineGraph(): void {
    this.barChartType = 'line';
  }

  setBarGraph(): void {
    this.barChartType = 'bar';
  }

  // setLineGraphTrend(): void {
  //   this.barChartType = "line";
  // }

  // setBarGraphTrend(): void {
  //   this.barChartType = "bar";
  // }
}
