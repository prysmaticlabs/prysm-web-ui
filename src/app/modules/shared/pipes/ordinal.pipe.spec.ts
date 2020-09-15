import { OrdinalPipe } from './ordinal.pipe';

describe('OrdinalPipe', () => {
  it('transforms unique cases such as 1, 2, and 3 into ordinal form', () => {
    const pipe = new OrdinalPipe();
    expect(pipe.transform(1)).toEqual('1st');
    expect(pipe.transform(2)).toEqual('2nd');
    expect(pipe.transform(3)).toEqual('3rd');
  });
  
  it('transforms other numbers into ordinal form', () => {
    const pipe = new OrdinalPipe();
    expect(pipe.transform(20)).toEqual('20th');
    expect(pipe.transform(25)).toEqual('25th');
    expect(pipe.transform(110)).toEqual('110th');
  });
});
