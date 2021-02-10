import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUserData } from 'src/app/models/user-data.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  options: any;

  userData: IUserData;
  private chartType = 'bar';

  private userDataSubscription: Subscription;

  constructor(private user: UserService) { }

  ngOnInit(): void {

    this.userDataSubscription = this.user.dataSubject.subscribe((data) => {
      this.userData = data;
      this.updateChart();
    })


  }

  private updateChart() {
    const xAxisData: string[] = [];
    const data1: string[] = [];

    this.userData.data.weight.forEach((data) => {
      xAxisData.push(data.date);
      data1.push(data.value);
    })

    this.options = {
      legend: {
        data: ['Waga (kg)'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'Waga (kg)',
          type: this.chartType,
          data: data1,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }

  onChartTypeChange(event: { checked: boolean }) {
    this.chartType = event.checked ? 'line' : 'bar';
    this.updateChart();
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}

