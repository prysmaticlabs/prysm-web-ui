import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SLOTS_PER_EPOCH, MILLISECONDS_PER_SLOT, GWEI_PER_ETHER } from 'src/app/modules/core/constants';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ChainHead, ValidatorBalances, ValidatorBalances_Balance } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Subject, zip } from 'rxjs';
import { BigNumber } from 'ethers';
import * as moment from 'moment';

const EPOCH_LOOKBACK = 4;
const NUM_ACCOUNTS = 10;

interface EpochBalances {
  lowestBalances: BigNumber[];
  avgBalances: BigNumber[];
  highestBalances: BigNumber[];
  timestamps: string[];
}

interface EpochDeltas {
  lowestDeltas: number[];
  avgDeltas: number[];
  highestDeltas: number[];
}

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
      this.validatorService.recentEpochBalances(head.headEpoch, EPOCH_LOOKBACK, NUM_ACCOUNTS)
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
    const bals = this.computeEpochBalances(genesisTime, balances);
    const deltas = this.computeEpochDeltas(bals);
    const xAxisData = bals.timestamps.slice(1, bals.timestamps.length);
    this.options = {
      legend: {
        data: ['Worst performing validator', 'Average performing validator', 'Best performing validator'],
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
        data: xAxisData,
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
          name: 'Worst performing validator',
          type: 'bar',
          barGap: 0,
          data: deltas.lowestDeltas,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Average performing validator',
          type: 'bar',
          barGap: 0,
          data: deltas.avgDeltas,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Best performing validator',
          type: 'bar',
          barGap: 0,
          data: deltas.highestDeltas,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }

  private computeEpochBalances(
    genesisTime: number, balances: ValidatorBalances[]
  ): EpochBalances {
    const lowestBalances: BigNumber[] = [];
    const highestBalances: BigNumber[] = [];
    const avgBalances: BigNumber[] = [];
    const timestamps: string[] = [];

    for (let i = 0; i < balances.length; i++) {
      const epoch = balances[i].epoch;
      const epochTimestamp = this.computeEpochTimestamp(genesisTime, epoch);

      const pureBalances = balances[i].balances.map(b => BigNumber.from(b.balance));
      const total = pureBalances.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
      const avg = total.div(pureBalances.length);
      const lowestBal = this.minbigNum(pureBalances);
      const highestBal = this.maxBigNum(pureBalances);

      const formatted = moment(epochTimestamp).format('hh:mm:ss');
      timestamps.push(`epoch ${epoch} ${formatted}`);
      avgBalances.push(avg);
      lowestBalances.push(lowestBal);
      highestBalances.push(highestBal);
    }
    return {
      lowestBalances,
      avgBalances,
      highestBalances,
      timestamps,
    };
  }

  private computeEpochDeltas(bals: EpochBalances): EpochDeltas {
    const lowestDeltas: number[] = [];
    const avgDeltas: number[] = [];
    const highestDeltas: number[] = [];
    for (let i = 0; i < (bals.avgBalances.length - 1); i++) {
      const lowCurr = bals.lowestBalances[i];
      const lowNext = bals.lowestBalances[i + 1];
      lowestDeltas.push(lowNext.sub(lowCurr).toNumber() / GWEI_PER_ETHER);

      const avgCurr = bals.avgBalances[i];
      const avgNext = bals.avgBalances[i + 1];
      avgDeltas.push(avgNext.sub(avgCurr).toNumber() / GWEI_PER_ETHER);

      const highCurr = bals.highestBalances[i];
      const highNext = bals.highestBalances[i + 1];
      highestDeltas.push(highNext.sub(highCurr).toNumber() / GWEI_PER_ETHER);
    }
    return {
      lowestDeltas,
      avgDeltas,
      highestDeltas,
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

  private computeEpochTimestamp(genesisTime: number, epoch: string): Date {
    const totalMilliseconds = BigNumber.from(epoch).mul(SLOTS_PER_EPOCH).mul(MILLISECONDS_PER_SLOT);
    const genesisTimeMilliseconds = genesisTime * 1000;
    const millisecondsSinceGenesis = totalMilliseconds.add(genesisTimeMilliseconds);
    return new Date(millisecondsSinceGenesis.toNumber());
  }
}
