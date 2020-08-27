import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';

@Component({
  selector: 'app-generate-mnemonic',
  templateUrl: './generate-mnemonic.component.html',
})
export class GenerateMnemonicComponent {
  mnemonic$: Observable<string> = this.walletService.generateMnemonic$;
  constructor(private walletService: WalletService) { }
}
