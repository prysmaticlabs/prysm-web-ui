import { Store } from './simple-store';

describe('Store', () => {
  it('should only fire an event over the behavior subject if data has changed', (done) => {
    const item = {
      title: 'Foo',
      subtitle: 'Bar',
    };
    const store = new Store(item);
    store.subscribe(res => {
      expect(res).toEqual(item);
      done();
    });
    store.subscribe(res => {
      expect(res).toEqual(item);
      done();
    });
    expect(store.observers.length).toEqual(2);

    // We spy on the superclass 'next' method (BehaviorSubject).
    const superSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(store)), 'next');
    // We send the item over the store 2 times
    // but expect 0 calls to the superclass next()
    // method given the data has not changed.
    store.next(item);
    store.next(item);
    expect(superSpy).toHaveBeenCalledTimes(0);

    // Next, we change the item and fire again and now
    // we should have seen the super class's next() method get called.
    store.next({
      title: 'Hello',
      subtitle: 'World',
    });
    expect(superSpy).toHaveBeenCalledTimes(1);
    store.complete();
  });
});
