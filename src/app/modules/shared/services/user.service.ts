import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {
    this.setUser(this.getUser());
  }

  private userKeyStore = 'user-prysm';
  private user: User | null | undefined;
  private onUserChange = new BehaviorSubject<User>((null as any) as User);
  user$ = this.onUserChange.asObservable();

  changeAccountListPerPage(accountListPerPage: number): void {
    if (!this.user) {
      return;
    }
    this.user.acountsPerPage = accountListPerPage;
    this.saveChanges();
  }

  changeGainsAndLosesPageSize(pageSize: number): void {
    if (!this.user) {
      return;
    }
    this.user.gainAndLosesPageSize = pageSize;
    this.saveChanges();
  }

  private saveChanges(): void {
    if (this.user) {
      localStorage.setItem(this.userKeyStore, JSON.stringify(this.user));
      this.onUserChange.next(this.user);
    }
  }

  private getUser(): User {
    const userStr = localStorage.getItem(this.userKeyStore);
    if (!userStr) {
      const user = new User();
      return user;
    } else {
      const user = new User(JSON.parse(userStr));
      return user;
    }
  }

  private setUser(user: User): void {
    this.user = user;
    this.saveChanges();
  }
}
