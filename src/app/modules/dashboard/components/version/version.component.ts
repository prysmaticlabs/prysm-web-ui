import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
})
export class VersionComponent {
  constructor(
    private validatorService: ValidatorService,
  ) { }

  version$ = this.validatorService.version$;
}
