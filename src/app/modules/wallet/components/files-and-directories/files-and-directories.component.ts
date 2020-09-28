import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KeymanagerKind, WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-files-and-directories',
  templateUrl: './files-and-directories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesAndDirectoriesComponent {
  @Input() wallet: WalletResponse | null = null;
  constructor() { }
  Kinds = KeymanagerKind;
}
