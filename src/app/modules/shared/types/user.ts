export class User {
  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
  acountsPerPage = 5;
  gainAndLosesPageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100, 250];
}
