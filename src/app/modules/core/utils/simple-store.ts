import { BehaviorSubject } from 'rxjs';
import deepFreeze from './deep-freeze';

export class Store<T> extends BehaviorSubject<T> {
  constructor(initialData: T) {
    super(deepFreeze(initialData));
  }

  next(newData: T): void {
    const frozenData = deepFreeze(newData);
    if (!naiveObjectComparison(frozenData, this.getValue())) {
      super.next(frozenData);
    }
  }
}

export function naiveObjectComparison(objOne: any, objTwo: any): boolean {
  return JSON.stringify(objOne) === JSON.stringify(objTwo);
}