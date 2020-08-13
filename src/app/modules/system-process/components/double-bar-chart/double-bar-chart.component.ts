import { Component } from '@angular/core';

@Component({
  selector: 'app-double-bar-chart',
  templateUrl: './double-bar-chart.component.html',
  styleUrls: ['./double-bar-chart.component.scss']
})
export class DoubleBarChartComponent {
  options = {
    grid: {
      top: "10%",
      bottom: "10%",
      // left: "5%",
      right: "5%"
    },
    legend: {
      show: false
    },
    color: [
      "#7467ef",
      "#ff9e43",
    ],
    barGap: 0,
    barMaxWidth: "64px",
    tooltip: {},
    dataset: {
      source: [
        ["Month", "Website", "App"],
        ["Jan", 2200, 1200],
        ["Feb", 800, 500],
        ["Mar", 700, 1350],
        ["Apr", 1500, 1250],
        ["May", 2450, 450],
        ["June", 1700, 1250]
      ]
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'white',
        fontSize: 13,
        fontFamily: "roboto"
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        // show: false
        lineStyle: {
          color: 'white',
          opacity: 0.15
        }
      },
      axisLabel: {
        color: 'white',
        fontSize: 13,
        fontFamily: "roboto"
      }
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{ type: "bar" }, { type: "bar" }]
  };
}
