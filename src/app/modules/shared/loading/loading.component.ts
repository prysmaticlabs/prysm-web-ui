import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent {

  @Input() loading = false;
  @Input() hasError = false;
  @Input() noData = false;

  @Input() loadingMessage: string | null = null;
  @Input() errorMessage: string | null = null;
  @Input() noDataMessage: string | null = null;

  @Input() errorImage: string | null = null;
  @Input() noDataImage: string | null = null;
  @Input() loadingImage: string | null = null;

  @Input() loadingTemplate: TemplateRef<any> | null = null;

  @Input() minHeight = '200px';
  @Input() minWidth = '100%';


  constructor() { }

  getMessage(): string | null {
    let message: string | null = null;
    if (this.loading) {
      message = this.loadingMessage;
    }
    else if (this.errorMessage) {
      message = this.errorMessage || 'An error occured.';
    }
    else if (this.noData) {
      message = this.noDataMessage || 'No data was loaded';
    }
    return message;
  }

}
