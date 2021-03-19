declare global {
  interface Date {
    toDateTimeString(this: Date): string;
  }
}

Date.prototype.toDateTimeString = function(): string {
  const d = this;
  return `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
};

export class extensions {}
