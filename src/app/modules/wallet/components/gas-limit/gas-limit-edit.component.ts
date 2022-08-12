import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';

@Component({
  selector: 'app-gas-limit-edit',
  templateUrl: './gas-limit-edit.component.html',
})
export class EditGasLimitComponent implements OnInit {
  publicKey: string;
  gasLimit: string = "";
  addPubkeyControl = this.formBuilder.control(null,[ Validators.pattern('^(0x){1}[A-Fa-f0-9]{96}$')]);
  confirmGroup: FormGroup = this.formBuilder.group({
    options: ['SET'],
    gaslimit: ['',[Validators.required,Validators.pattern('^0x[a-fA-F0-9]{40}$')]],
    confirmation: ['', [Validators.required, UtilityValidator.MustBe('agree')]],
  });

  constructor(
    private ref: MatDialogRef<EditGasLimitComponent>,
    private validatorService: ValidatorService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: {publickey:string}
  ) {
    this.publicKey = this.data.publickey;
    this.validatorService.getGasLimit(this.data.publickey).subscribe(gas => {
      if(gas){
        this.gasLimit = gas.data.gas_limit
      }
    });
  }

  ngOnInit(){
    this.confirmGroup.controls['options'].valueChanges.subscribe(value=>{
      if(value === 'DELETE'){
        this.confirmGroup.controls['gaslimit'].reset();
        this.confirmGroup.controls['gaslimit'].removeValidators([Validators.required,Validators.pattern('/^[1-9][0-9]*$/')]);
        this.confirmGroup.controls['gaslimit'].updateValueAndValidity();
      }
      if(value === 'SET'){
        this.confirmGroup.controls['gaslimit'].addValidators([Validators.required,Validators.pattern('/^[1-9][0-9]*$/')]);
        this.confirmGroup.controls['gaslimit'].updateValueAndValidity();
      }
    });
  }
 
  cancel(): void {
    this.ref.close();
  }


  confirm(): void {
    let updateGasLimit$;
    switch(this.confirmGroup.controls['options'].value) {
      case 'DELETE':
        updateGasLimit$ = this.validatorService.deleteGasLimit(base64ToHex(this.publicKey));
        break;
      case 'SET':
        updateGasLimit$ = this.validatorService.setGasLimit(base64ToHex(this.publicKey),{gas_limit:this.confirmGroup.controls['gaslimit'].value});
        break;
    }
    if(updateGasLimit$) {
      updateGasLimit$.subscribe(()=>{
          this.toastr.success(
            `${base64ToHex(this.publicKey).substring(0, 10)}... updated gas limit`,
          );
          this.validatorService.refreshTableDataTrigger$.next(true);
          this.ref.close();
        }, (error) => {
          this.toastr.error(
            `${base64ToHex(this.publicKey).substring(0, 10)}... failed to update gas limit`,error,{
            timeOut: 20000,
          });
          this.ref.close();
        });
    }
  
  }

  
}
