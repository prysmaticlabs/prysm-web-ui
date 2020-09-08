import range from './range';

describe('range', () => {
  it('should create range of numbers upper limit exclusive', () => {
    const arr = range(0, 2);
    expect(arr.length).toEqual(2);
    expect(arr).toEqual([0, 1]);
  });

  it('should create an empty array if range is 0, 0', () => {
    const arr = range(0, 0);
    expect(arr.length).toEqual(0);
  });

  it('should throw error if end < start', () => {
    const badCall = () => {
      range(0, -100);
    };
    expect(badCall).toThrowError();
  });
});