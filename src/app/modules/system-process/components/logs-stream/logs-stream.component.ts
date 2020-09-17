import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import {
  default as AnsiUp
} from 'ansi_up';

@Component({
  selector: 'app-logs-stream',
  templateUrl: './logs-stream.component.html',
})
export class LogsStreamComponent implements AfterViewInit {
  @Input() messages: string[] | null = null;
  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef | null = null;
  @ViewChildren('item') itemElements: QueryList<any> | null = null;
  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  private scrollContainer: any;
  private ansiUp = new AnsiUp();

  ngAfterViewInit(): void {
    this.scrollContainer = this.scrollFrame?.nativeElement;
    this.itemElements?.changes.subscribe(_ => this.onItemElementsChanged());
  }

  formatLog(msg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.ansiUp.ansi_to_html(msg));
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}
