import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  options = {
    title: {
      text: 'Validator data breakdown',
      subtext: 'Some sample pie chart data',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      x: 'center',
      y: 'bottom',
      data: ['item1', 'item2', 'item3', 'item4']
    },
    calculable: true,
    series: [
      {
        name: 'area',
        type: 'pie',
        radius: [30, 110],
        roseType: 'area',
        data: [
          { value: 10, name: 'item1' },
          { value: 30, name: 'item2' },
          { value: 45, name: 'item3' },
          { value: 15, name: 'item4' },
        ]
      }
    ]
  };
}
