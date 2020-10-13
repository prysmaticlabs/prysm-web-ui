import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-files-and-directories',
  templateUrl: './files-and-directories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesAndDirectoriesComponent {
  @Input() wallet: WalletResponse | null = null;
  constructor() { }
  walletDirTooltip = 'The directory on disk which your validator client uses to determine the location of your' +
    ' validating keys and accounts configuration';
  keystoreTooltip = 'An EIP-2335 compliant, JSON file storing all your validating keys encrypted by a strong password';
  encryptedSeedTooltip = 'An EIP-2335 compliant JSON file containing your encrypted wallet seed';
}
