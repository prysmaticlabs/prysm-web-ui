import { Component, Input, OnInit } from '@angular/core';

export enum LOADING_CONTENT_TYPES {
  LIST = "list.svg",
  CHART  = "chart.svg"
};

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {

  @Input() loading: boolean = false;
  @Input() hasError: boolean = false;
  @Input() noData: boolean = false;

  @Input() loadingMessage: string;
  @Input() errorMessage: string;
  @Input() noDataMessage: string;

  @Input() loadingContentType: LOADING_CONTENT_TYPES;

  @Input() minHeight: string = "200px";
  @Input() minWidth: string = "100%";

  constructor() { }

  ngOnInit(): void {
  }

  getMessage(): string {
    let message: string;
    if (this.loading) {
      message = this.loadingMessage || "Loading data";
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
