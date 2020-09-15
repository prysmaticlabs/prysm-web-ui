import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

export const LOADING_IMAGE_FOR_CONTENT_TYPE = {
  INFO_BOX: "/assets/images/skeletons/info_box.svg",
  LIST: "/assets/images/skeletons/list.svg",
  LIST_VERTICAL: "/assets/images/skeletons/list_vertical.svg",
  CHART:"/assets/images/skeletons/chart.svg",
  TABLE: "/assets/images/skeletons/table.svg"
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

  @Input() errorImage: string;
  @Input() noDataImage: string;
  @Input() loadingImage: string;

  @Input() loadingTemplate: TemplateRef<any>;

  @Input() minHeight: string = "200px";
  @Input() minWidth: string = "100%";


  constructor() { }

  ngOnInit(): void {
  }

  getMessage(): string {
    let message: string;
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
