import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MockService } from 'ng-mocks';

import { ValidatorService } from './validator.service';
import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';
import { Observable, of } from 'rxjs';
import { Account, ListAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { ENVIRONMENT } from 'src/environments/token';

describe('ValidatorService', () => {
  let service: ValidatorService = MockService(ValidatorService);
  let beaconNodeService: BeaconNodeService = MockService(BeaconNodeService);
  let walletService: WalletService = MockService(WalletService);
  (beaconNodeService as any)['nodeEndpoint$'] = of('endpoint');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ENVIRONMENT, useValue: jasmine.createSpyObj('EnvironmenterService', ['env']) },
        { provide: BeaconNodeService, useValue: beaconNodeService },
        { provide: WalletService, useValue: walletService },
        { provide: ValidatorService, useValue: service },
      ]
    });
    service = TestBed.inject(ValidatorService);
    beaconNodeService = TestBed.inject(BeaconNodeService);
    walletService = TestBed.inject(WalletService);
    walletService.validatingPublicKeys$ = of([] as string[]);
    walletService.accounts = (pageIndex?: number, pageSize?: number): Observable<ListAccountsResponse> => of({
      accounts: [] as Account[]
    } as ListAccountsResponse);
    spyOn(walletService, 'accounts').and.returnValue(of({
      accounts: [] as Account[],
    } as ListAccountsResponse));
  });
});
