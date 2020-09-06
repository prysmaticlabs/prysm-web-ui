import { Component, OnInit, Input } from '@angular/core';
import { ValidatorBalances } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-balances-chart',
  templateUrl: './balances-chart.component.html',
})
export class BalancesChartComponent implements OnInit {
  @Input() validatorBalances: ValidatorBalances[];
  options: any;
  constructor() {}

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    const xAxisData = [];
    const data1 = [];
    // const data2 = [];

    for (let i = 0; i < this.validatorBalances.length; i++) {
      xAxisData.push(i);
      // Use 0th validator.
      const epochBalance = this.validatorBalances[i].balances[0];
      data1.push(epochBalance.balance);
    }

    this.options = {
      legend: {
        data: ['bar', 'bar2'],
        align: 'left',
        textStyle: {
          color: 'white',
          fontSize: 13,
          fontFamily: 'roboto',
        }
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'white',
          fontSize: 14,
          fontFamily: 'roboto',
        }
      },
      color: [
        "#7467ef",
        "#ff9e43",
      ],
      yAxis: {},
      series: [
        {
          name: 'bar',
          type: 'bar',
          data: data1,
          animationDelay: (idx) => idx * 10,
        },
        // {
        //   name: 'bar2',
        //   type: 'bar',
        //   data: data2,
        //   animationDelay: (idx) => idx * 10 + 100,
        // },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }
}
