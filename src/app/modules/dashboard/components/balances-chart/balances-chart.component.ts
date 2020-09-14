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
    const lowest: number[] = [];
    const highest: number[] = [];
    const avgBalances: number[] = [];
    for (let i = 0; i < balances.length; i++) {
      let epoch = balances[i].epoch
      let totalMilliseconds = epoch * MILLISECONDS_PER_SLOT * SLOTS_PER_EPOCH
      let timeSinceGenesis = new Date(genesisTime*1000 + totalMilliseconds);
      const pureBalances = balances[i].balances.map(b => BigNumber.from(b.balance));
      const total = pureBalances.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
      const avg = total.div(pureBalances.length).toNumber() / GWEI_PER_ETHER;
      const lowestBal = this.minbigNum(pureBalances).toNumber() / GWEI_PER_ETHER;
      const highestBal = this.maxBigNum(pureBalances).toNumber() / GWEI_PER_ETHER;

      const formatted = moment(timeSinceGenesis).format('hh:mm:ss');
      console.log(formatted);
      xAxisData.push(`epoch ${epoch} ${formatted}`);
      avgBalances.push(avg);
      lowest.push(lowestBal);
      highest.push(highestBal);
    }
    let globalMin = Math.min(...lowest);
    if (globalMin !== 0) {
      globalMin -= (globalMin * 0.00002);
    }
    const globalMinFixed = globalMin.toFixed(3);
 
    this.options = {
      legend: {
        data: ['Lowest balance', 'Average balance', 'Highest balance'],
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
        "#7467ef",
        "#ff9e43",
        "rgba(51, 217, 178, 1)",
      ],
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        min: globalMinFixed,
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
          name: 'Lowest balance',
          type: 'bar',
          barGap: 0,
          data: lowest,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Average balance',
          type: 'bar',
          barGap: 0,
          data: avgBalances,
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Highest balance',
          type: 'bar',
          barGap: 0,
          data: highest,
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
