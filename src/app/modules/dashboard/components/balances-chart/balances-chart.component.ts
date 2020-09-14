import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SLOTS_PER_EPOCH, MILLISECONDS_PER_SLOT, GWEI_PER_ETHER } from 'src/app/modules/core/constants';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ChainHead, ValidatorBalances } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Subject, zip } from 'rxjs';
import { BigNumber } from 'ethers';
import * as moment from 'moment';

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
      this.validatorService.recentEpochBalances(head.headEpoch, 4 /* lookback */)
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

  updateData(genesisTime: number, balances: ValidatorBalances[]): void {
    const xAxisData = [];
    const data1 = [];

    const avgBalances: number[] = [];
    for (let i = 0; i < balances.length; i++) {
      let epoch = balances[i].epoch
      let totalMilliseconds = epoch * MILLISECONDS_PER_SLOT * SLOTS_PER_EPOCH
      let timeSinceGenesis = new Date(genesisTime*1000 + totalMilliseconds);
      const pureBalances = balances[i].balances.map(b => BigNumber.from(b.balance));
      const total = pureBalances.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
      const avg = total.div(pureBalances.length).toNumber() / GWEI_PER_ETHER;

      avgBalances.push(avg);
      const formatted = moment(timeSinceGenesis).format('hh:mm:ss');
      xAxisData.push(formatted);
      data1.push(avg);
    }
    let globalMin = Math.min(...avgBalances);
    if (globalMin !== 0) {
      globalMin -= (globalMin * 0.00002);
    }
    const globalMinFixed = globalMin.toFixed(3);
 
    this.options = {
      legend: {
        data: ['Average balance'],
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
        // "#ff9e43",
      ],
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        min: globalMinFixed,
        axisLine: {
          lineStyle: {
            color: 'white',
          },
        }
      },
      series: [
        {
          name: 'Average balance',
          type: 'bar',
          data: data1,
          animationDelay: (idx: number) => idx * 10,
        },
        // {
        //   name: 'Range balance',
        //   type: 'line',
        //   data: data2,
        //   animationDelay: (idx: number) => idx * 20,
        // },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }
}
