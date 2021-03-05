import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'wallet-component',
  styles: [''],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class WalletComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
