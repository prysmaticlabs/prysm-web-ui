import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { NotificationService } from '../../shared/services/notification.service';
import { GlobalDialogService } from '../components/global-dialog/global-dialog.service';
import { EnvironmenterService } from './environmenter.service';

import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['notifyError']);
  const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['clearCachedToken']);
  const environmenterServiceSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);
  const globalDialogServiceSpy = jasmine.createSpyObj('GlobalDialogService', ['close', 'open']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  let service: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        GlobalErrorHandler,
        {
          provide: NotificationService,
          useValue: notificationServiceSpy
        },
        {
          provide: AuthenticationService,
          useValue: authServiceSpy
        },
        {
          provide: EnvironmenterService,
          useValue: environmenterServiceSpy
        },
        {
          provide: GlobalDialogService,
          useValue: globalDialogServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy
        }
      ]
    });
    service = TestBed.inject(GlobalErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
