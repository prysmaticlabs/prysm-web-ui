import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { WalletSelection, WalletKind } from '../../types/wallet';
import { ChooseWalletKindComponent } from './choose-wallet-kind.component';
import { Subject } from 'rxjs';

describe('ChooseWalletKindComponent', () => {
  let component: ChooseWalletKindComponent;
  let fixture: ComponentFixture<ChooseWalletKindComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseWalletKindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseWalletKindComponent);
    component = fixture.componentInstance;
    const walletSelections: WalletSelection[] = [
      {
        kind: WalletKind.Imported,
        name: 'Non-HD Wallet',
        description: '(Basic) Simple wallet that allows to importing keys from an external source',
        image: '/assets/images/onboarding/direct.svg',
      },
      {
        kind: WalletKind.Derived,
        name: 'HD Wallet',
        description: '(Default) Secure kind of blockchain wallet which can be recovered from a 24-word mnemonic phrase',
        image: '/assets/images/onboarding/lock.svg',
      },
    ];
    component.walletSelections = walletSelections;
    component.selectedCard = 0;
    component.selectedWallet$ = new Subject<WalletKind>();
    fixture.detectChanges();
  });

  it('should display wallet selections', () => {
    const cards = fixture.debugElement.query(By.css('.onboarding-grid'));
    expect(cards.children.length).toEqual(2);

    // We expect the 0th index card to have the active class.
    expect(cards.children[0].classes.active).toBeTruthy();

    // We attempt to click on the different cards to check
    // if the active card changed.
    const cardDiv: HTMLElement = cards.children[1].nativeElement;
    cardDiv.click();
    fixture.detectChanges();

    // We expect the 1st index card to have the active class.
    expect(cards.children[1].classes.active).toBeTruthy();
    expect(component.selectedCard).toEqual(1);
  });

  it('should fire wallet kind selection over subject on button submission', (done) => {
    component.selectedWallet$?.subscribe(kind => {
      expect(kind).toEqual(WalletKind.Imported);
      done();
    });
    const cards = fixture.debugElement.query(By.css('.onboarding-grid'));
    // We click on the submit button of the 0th card, which corresponds to
    // a non-HD wallet selection.
    const nonHDButton: HTMLElement = cards.children[0].nativeElement.querySelector('button');
    nonHDButton.click();
    fixture.detectChanges();
  });
});
