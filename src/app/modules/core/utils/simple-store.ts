import { BehaviorSubject } from 'rxjs';

export class Store<T> extends BehaviorSubject<T> {
  constructor(initialData: T) {
    super(initialData);
  }

  next(newData: T): void {
    const frozenData: T = newData;
    if (!naiveObjectComparison(frozenData, this.getValue())) {
      super.next(frozenData);
    }
  }
}

export function naiveObjectComparison<T, R>(objOne: T, objTwo: R): boolean {
  return JSON.stringify(objOne) === JSON.stringify(objTwo);
}
