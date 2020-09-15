import { Component } from '@angular/core';

@Component({
  selector: 'app-proposed-missed-chart',
  templateUrl: './proposed-missed-chart.component.html',
})
export class ProposedMissedChartComponent {
  options = {
    barGap: 50,
    barMaxWidth: '6px',

    grid: {
      top: 24,
      left: 26,
      right: 26,
      bottom: 25
    },

    legend: {
      itemGap: 32,
      top: -4,
      left: -4,
      icon: 'circle',
      width: 'auto',
      data: ['Atts Included', 'Missed Atts', 'Orphaned'],
      textStyle: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'roboto',
        align: 'center'
      }
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      showGrid: false,
      boundaryGap: false,
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'roboto',
        margin: 16
      },
      axisTick: {
        show: false
      }
    },
    color: [
      '#7467ef',
      '#e95455',
      '#ff9e43',
    ],
    yAxis: {
      type: 'value',
      show: false,
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Atts Included',
        data: [70, 80, 80, 80, 60, 70, 40],
        type: 'bar',
        itemStyle: {
          barBorderRadius: [0, 0, 10, 10]
        },
        stack: 'one'
      },
      {
        name: 'Missed Atts',
        data: [40, 90, 100, 70, 80, 65, 50],
        type: 'bar',
        stack: 'one'
      },
      {
        name: 'Orphaned',
        data: [30, 70, 100, 90, 70, 55, 40],
        type: 'bar',
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0]
        },
        stack: 'one'
      }
    ]
  };
}
