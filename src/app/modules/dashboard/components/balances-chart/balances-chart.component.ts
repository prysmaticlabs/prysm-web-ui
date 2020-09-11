import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SLOTS_PER_EPOCH, MILLISECONDS_PER_SLOT } from 'src/app/modules/core/constants';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ChainHead, ValidatorBalances } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Subject, zip } from 'rxjs';
import { WHITE_ON_BLACK_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';

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

  balances$ = this.beaconService.chainHead$.pipe(
    switchMap((head: ChainHead) =>
      this.validatorService.recentEpochBalances(head.headEpoch, 6 /* lookback */)
    ),
  );

  ngOnInit(): void {
    const updateData = this.updateData.bind(this);
    zip(this.beaconService.genesisTime$, this.balances$).pipe(
      takeUntil(this.destroyed$$),
    ).subscribe(([genesisTime, balances]) => updateData(genesisTime, balances));
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  randomData() {
    const now = new Date();
    const value = Math.random() * 21 - 10;
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(value)
      ]
    };
  }

  updateData(genesisTime: number, balances: ValidatorBalances[]): void {
    console.log(balances);
    console.log(genesisTime);
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < balances.length; i++) {
      let epoch = balances[i].epoch
      let totalMilliseconds = epoch * MILLISECONDS_PER_SLOT * SLOTS_PER_EPOCH
      console.log(totalMilliseconds);
      let now = new Date(genesisTime*1000 + totalMilliseconds);
      data1.push({
        name: now.toString(),
        value: [
          now,
          balances[i].balances[0].balance,
        ]
      });
      data2.push({
        name: now.toString(),
        value: [
          now,
          balances[i].balances[0].balance + (0.02 * i),
        ]
      });
    }

    this.options = {
      legend: {
        data: ['bar'],
        align: 'left',
        textStyle: {
          color: 'white',
          fontSize: 13,
          fontFamily: 'roboto',
        }
      },
      textStyle: {
        color: 'white',
      },
      tooltip: {},
      xAxis: {
        type: 'time',
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'white',
          fontSize: 14,
          fontFamily: 'roboto',
        },
        axisLine: {
          lineStyle: {
            color: 'white',
          },
        }
      },
      color: [
        "#7467ef",
        "#ff9e43",
      ],
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        min: '32.27',
        max: '32.4',
        axisLine: {
          lineStyle: {
            color: 'white',
          },
        }
      },
      series: [
        {
          name: 'Average balance',
          type: 'line',
          data: data1,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Range balance',
          type: 'line',
          data: data2,
          animationDelay: (idx: number) => idx * 20,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }
}
