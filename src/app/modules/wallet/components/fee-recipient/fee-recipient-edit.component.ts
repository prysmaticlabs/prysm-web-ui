import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';

@Component({
  selector: 'app-fee-recipient-edit',
  templateUrl: './fee-recipient-edit.component.html',
})
export class EditFeeRecipientComponent implements OnInit {
  publicKey: string;
  addPubkeyControl = this.formBuilder.control(null,[ Validators.pattern('^(0x){1}[A-Fa-f0-9]{96}$')]);
  confirmGroup: FormGroup = this.formBuilder.group({
    options: ['SET'],
    feerecipient: ['',[Validators.required,Validators.pattern('^0x[a-fA-F0-9]{40}$')]],
    confirmation: ['', [Validators.required, UtilityValidator.MustBe('agree')]],
  });

  constructor(
    private ref: MatDialogRef<EditFeeRecipientComponent>,
    private validatorService: ValidatorService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: {publickey:string,ethaddress:string}
  ) {
    this.publicKey = this.data.publickey;
  }

  ngOnInit(){
    this.confirmGroup.controls['options'].valueChanges.subscribe(value=>{
      if(value === 'DELETE'){
        this.confirmGroup.controls['feerecipient'].reset();
        this.confirmGroup.controls['feerecipient'].removeValidators([Validators.required,Validators.pattern('/^0x[a-fA-F0-9]{40}$/')]);
        this.confirmGroup.controls['feerecipient'].updateValueAndValidity();
      }
      if(value === 'SET'){
        this.confirmGroup.controls['feerecipient'].addValidators([Validators.required,Validators.pattern('/^0x[a-fA-F0-9]{40}$/')]);
        this.confirmGroup.controls['feerecipient'].updateValueAndValidity();
      }
    });
  }
 
  cancel(): void {
    this.ref.close();
  }


  confirm(): void {
    let updateFeeRecipient$;
    switch(this.confirmGroup.controls['options'].value) {
      case 'DELETE':
        updateFeeRecipient$ = this.validatorService.deleteFeeRecipient(this.publicKey);
        break;
      case 'SET':
        updateFeeRecipient$ = this.validatorService.setFeeRecipient(this.publicKey,{ethaddress:this.confirmGroup.controls['feerecipient'].value});
        break;
    }
    if(updateFeeRecipient$) {
      updateFeeRecipient$.subscribe(()=>{
          this.toastr.success(
            `${this.publicKey.substring(0, 10)}... updated fee recipient`,
          );
          this.validatorService.refreshTableDataTrigger$.next(true);
          this.ref.close();
        }, (error) => {
          this.toastr.error(
            `${this.publicKey.substring(0, 10)}... failed to update fee recipient`,error,{
            timeOut: 20000,
          });
          this.ref.close();
        });
    }
  
  }

  
}
