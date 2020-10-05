import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SLOTS_PER_EPOCH, MILLISECONDS_PER_SLOT, GWEI_PER_ETHER } from 'src/app/modules/core/constants';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
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
      this.validatorService.recentEpochBalances(head.headEpoch, 4 /* lookback */, 3)
    ),
  );

  ngOnInit(): void {
    const updateData = this.updateData.bind(this);
    zip(this.beaconService.genesisTime$, this.balances$).pipe(
      tap(([genesisTime, balances]) => updateData(genesisTime, balances)),
      takeUntil(this.destroyed$$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  updateData(genesisTime: number, balances: ValidatorBalances[]): void {
    console.log(balances);
    const xAxisData = [];
    const lowest: BigNumber[] = [];
    const highest: BigNumber[] = [];
    const avgBalances: BigNumber[] = [];

    for (let i = 0; i < balances.length; i++) {
      const epoch = balances[i].epoch;
      const totalMilliseconds = BigNumber.from(epoch).mul(SLOTS_PER_EPOCH).mul(MILLISECONDS_PER_SLOT);
      const genesisTimeMilliseconds = genesisTime * 1000;
      const millisecondsSinceGenesis = totalMilliseconds.add(genesisTimeMilliseconds);
      const epochTimestamp = new Date(millisecondsSinceGenesis.toNumber());

      const pureBalances = balances[i].balances.map(b => BigNumber.from(b.balance));
      const total = pureBalances.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
      const avg = total.div(pureBalances.length);
      const lowestBal = this.minbigNum(pureBalances);
      const highestBal = this.maxBigNum(pureBalances);

      const formatted = moment(epochTimestamp).format('hh:mm:ss');
      xAxisData.push(`epoch ${epoch} ${formatted}`);
      avgBalances.push(avg);
      lowest.push(lowestBal);
      highest.push(highestBal);
    }

    // Compute deltas.
    const avgDelta: number[] = [];
    const lowestDelta: number[] = [];
    const highestDelta: number[] = [];
    for (let i = 0; i < (avgBalances.length - 1); i++) {
      const avgCurr = avgBalances[i];
      const avgNext = avgBalances[i + 1];
      console.log(avgNext.sub(avgCurr).toString());
      avgDelta.push(avgNext.sub(avgCurr).toNumber() / GWEI_PER_ETHER);

      const lowCurr = lowest[i];
      const lowNext = lowest[i + 1];
      lowestDelta.push(lowNext.sub(lowCurr).toNumber() / GWEI_PER_ETHER);

      const highCurr = highest[i];
      const highNext = highest[i + 1];
      highestDelta.push(highNext.sub(highCurr).toNumber() / GWEI_PER_ETHER);
    }
    const xData = xAxisData.slice(1, xAxisData.length);

    this.options = {
      legend: {
        data: ['Lowest ETH gains', 'Average ETH gains', 'Highest ETH gains'],
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
      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          magicType: {title: 'Bar/Line', show: true, type: ['line', 'bar']},
          saveAsImage: {title: 'Save', show: true}
        }
      },
      xAxis: {
        data: xData,
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
        '#7467ef',
        '#ff9e43',
        'rgba(51, 217, 178, 1)',
      ],
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        // min: globalMinFixed,
        axisLabel: {
          formatter: '{value} ETH'
        },
        axisLine: {
          lineStyle: {
            color: 'white',
          },
        }
      },
      series: [
        {
          name: 'Lowest ETH gains',
          type: 'bar',
          barGap: 0,
          data: lowestDelta,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Average ETH gains',
          type: 'bar',
          barGap: 0,
          data: avgDelta,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Highest ETH gains',
          type: 'bar',
          barGap: 0,
          data: highestDelta,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }

  private minbigNum(balances: BigNumber[]): BigNumber {
    if (!balances.length) {
      return BigNumber.from('0');
    }
    let min = balances[0];
    for (let i = 0; i < balances.length; i++) {
      if (balances[i].lt(min)) {
        min = balances[i];
      }
    }
    return min;
  }

  private maxBigNum(balances: BigNumber[]): BigNumber {
    if (!balances.length) {
      return BigNumber.from('0');
    }
    let max = balances[0];
    for (let i = 0; i < balances.length; i++) {
      if (balances[i].gt(max)) {
        max = balances[i];
      }
    }
    return max;
  }
}
