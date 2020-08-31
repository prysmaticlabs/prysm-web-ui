import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '../../../../environments/token';

@Injectable({
  providedIn: 'root'
})
export class EnvironmenterService {
  constructor(
    @Inject(ENVIRONMENT) private environment: Environment,
  ) {}
  public readonly env = this.environment;
}
