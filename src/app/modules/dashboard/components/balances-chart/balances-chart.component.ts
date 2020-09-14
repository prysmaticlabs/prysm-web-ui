import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SLOTS_PER_EPOCH, MILLISECONDS_PER_SLOT, GWEI_PER_ETHER } from 'src/app/modules/core/constants';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ChainHead, ValidatorBalances } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Subject, zip } from 'rxjs';
import { BigNumber } from 'ethers';

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
    console.log(balances);
    console.log(genesisTime);
    const xAxisData = [];
    const data1 = [];

    const avgBalances: BigNumber[] = [];
    for (let i = 0; i < balances.length; i++) {
      let epoch = balances[i].epoch
      let totalMilliseconds = epoch * MILLISECONDS_PER_SLOT * SLOTS_PER_EPOCH
      let timeSinceGenesis = new Date(genesisTime*1000 + totalMilliseconds);
      const pureBalances = balances[i].balances.map(b => BigNumber.from(b.balance));
      const total = pureBalances.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
      console.log(total.toString());
      const avg = total.div(pureBalances.length).div(GWEI_PER_ETHER);
      console.log(avg.toString());

      avgBalances.push(avg);
      xAxisData.push(timeSinceGenesis.toString());
      data1.push(avg.toNumber());
    }
    let globalMin = BigNumber.from('0');
    if (avgBalances.length) {
      globalMin = avgBalances[0];
    }
    avgBalances.forEach((bal: BigNumber, _) => {
      if (bal.lte(globalMin)) {
        globalMin = bal;
      }
    });
    console.log(avgBalances);
    console.log(globalMin.toString());

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
        min: globalMin.toNumber(),
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
