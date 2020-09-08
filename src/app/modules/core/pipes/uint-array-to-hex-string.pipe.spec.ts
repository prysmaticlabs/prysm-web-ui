import { UintArrayToHexStringPipe } from './uint-array-to-hex-string.pipe';

describe('UintArrayToHexStringPipe', () => {
  it('create an instance', () => {
    const pipe = new UintArrayToHexStringPipe();
    expect(pipe).toBeTruthy();
  });
});
