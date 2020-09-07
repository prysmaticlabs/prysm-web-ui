import { take } from 'rxjs/operators';

import { Store } from './simple-store';
import { select$ } from './select$';

describe('select$', () => {
  it('should share data across replays', (done) => {
    const item = {
      title: 'Foo',
      subtitle: 'Bar',
    }
    const store = new Store(item);
    const title$ = select$(
      store,
      res => res.title,
    );
    title$.pipe(
      take(1),
    ).subscribe(title => {
      expect(title).toEqual(item.title);
    }, null, done);
    title$.pipe(
      take(1),
    ).subscribe(title => {
      expect(title).toEqual(item.title);
    }, null, done);

    // We expect no events to fire in the super class (BehaviorSubject)
    // if the data remains the same.
    const superSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(store)), 'next');
    store.next(item);
    expect(superSpy).toHaveBeenCalledTimes(0);
    store.complete();
  });
});