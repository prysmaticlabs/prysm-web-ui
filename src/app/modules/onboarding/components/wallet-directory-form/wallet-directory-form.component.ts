import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wallet-directory-form',
  templateUrl: './wallet-directory-form.component.html',
})
export class WalletDirectoryFormComponent {
  @Input() formGroup: FormGroup | null = null;
  linux = '$HOME/.eth2validators/prysm-wallet-v2';
  macos = '$HOME/Library/Eth2Validators/prysm-wallet-v2';
  windows = `%LOCALAPPDATA%\\Eth2Validators\\prysm-wallet-v2`;
  constructor() { }
}
