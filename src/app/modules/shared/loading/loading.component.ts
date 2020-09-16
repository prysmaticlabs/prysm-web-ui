import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {

  @Input() loading: boolean = false;
  @Input() hasError: boolean = false;
  @Input() noData: boolean = false;

  @Input() loadingMessage: string | null = null;
  @Input() errorMessage: string | null = null;
  @Input() noDataMessage: string | null = null;

  @Input() errorImage: string | null = null;
  @Input() noDataImage: string | null = null;
  @Input() loadingImage: string | null = null;

  @Input() loadingTemplate: TemplateRef<any> | null = null;

  @Input() minHeight: string = "200px";
  @Input() minWidth: string = "100%";


  constructor() { }

  ngOnInit(): void {
  }

  getMessage(): string | null {
    let message: string | null = null;
    if (this.loading) {
      message = this.loadingMessage;
    }
    else if (this.errorMessage) {
      message = this.errorMessage || "An error occured.";
    }
    else if (this.noData) {
      message = this.noDataMessage || "No data was loaded";
    }
    return message;
  }

}
