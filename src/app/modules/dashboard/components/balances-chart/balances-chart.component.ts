import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balances-chart',
  templateUrl: './balances-chart.component.html',
})
export class BalancesChartComponent implements OnInit {
  // options = {
  //   grid: {
  //     top: '10%',
  //     bottom: '10%',
  //     left: '7%',
  //     right: '5%'
  //   },
  //   legend: {
  //     itemGap: 20,
  //     icon: 'circle',
  //     textStyle: {
  //       color: '#ff9e43',
  //       fontSize: 13,
  //       fontFamily: 'roboto'
  //     }
  //   },
  //   tooltip: {},
  //   xAxis: {
  //     type: 'category',
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //     axisLine: {
  //       show: false
  //     },
  //     axisTick: {
  //       show: false
  //     },
  //     axisLabel: {
  //       color: '#7467ef',
  //       fontSize: 14,
  //       fontFamily: 'roboto'
  //     }
  //   },
  //   yAxis: {
  //     min: 32.030,
  //     axisLine: {
  //       show: false
  //     },
  //     axisTick: {
  //       show: false
  //     },
  //     splitLine: {
  //       lineStyle: {
  //         color: '#7467ef',
  //         opacity: 0.15
  //       }
  //     },
  //     axisLabel: {
  //       color: '#7467ef',
  //       fontSize: 13,
  //       fontFamily: 'roboto'
  //     }
  //   },
  //   series: [
  //     {
  //       data: [32.032, 32.031, 32.038, 32.036, 32.042, 32.045, 32.044],
  //       type: 'line',
  //       stack: 'Your average',
  //       name: 'Your average',
  //       smooth: true,
  //       symbolSize: 4,
  //       lineStyle: {
  //         width: 4
  //       }
  //     },
  //     {
  //       data: [32.031, 32.030, 32.034, 32.037, 32.040, 32.046, 32.047],
  //       type: 'line',
  //       stack: 'Global average',
  //       name: 'Global average',
  //       smooth: true,
  //       symbolSize: 4,
  //       lineStyle: {
  //         width: 4
  //       }
  //     }
  //   ]
  // };

  options: any;
  constructor() {}

  ngOnInit(): void {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 100; i++) {
      xAxisData.push('category' + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
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
        '#7467ef',
        '#ff9e43',
      ],
      yAxis: {},
      series: [
        {
          name: 'bar',
          type: 'bar',
          data: data1,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'bar2',
          type: 'bar',
          data: data2,
          animationDelay: (idx: number) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }
}
