import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ChainHead, ValidatorBalances } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-balances-chart',
  templateUrl: './balances-chart.component.html',
})
export class BalancesChartComponent implements OnInit, OnDestroy {
  constructor(
    private validatorService: ValidatorService,
    private beaconService: BeaconNodeService,
  ) { }

  private destroyed$$ = new Subject<void>();
  options: any;

  ngOnInit(): void {
    this.beaconService.chainHead$.pipe(
      switchMap((head: ChainHead) =>
        this.validatorService.recentEpochBalances(head.headEpoch, 3 /* lookback */)
      ),
      takeUntil(this.destroyed$$),
    ).subscribe(this.updateData.bind(this));
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  updateData(balances: ValidatorBalances[]): void {
    console.log(balances);
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
        {
          name: 'bar2',
          type: 'bar',
          data: data2,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }
}
