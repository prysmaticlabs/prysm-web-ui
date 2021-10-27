import { Directive, ElementRef, HostBinding, Input, OnChanges } from '@angular/core';

@Directive({
  selector: 'a[href]'
})
export class ExternalLinkDirective implements OnChanges {

    constructor(private elementRef: ElementRef){}

    @HostBinding('attr.rel') relAttr: string | null = null;
    @HostBinding('attr.target') targetAttr: string | null = null;
    @Input() href: string | null = null;

    ngOnChanges(): void {

      this.elementRef.nativeElement.href = this.href;

      if (this.isLinkExternal()) {
        this.relAttr = 'noopener';
        this.targetAttr = '_blank';
      } else {
        this.relAttr = '';
        this.targetAttr = '';
      }
    }

    private isLinkExternal(): boolean {
      return !this.elementRef.nativeElement.hostname.includes(location.hostname);
    }
}
