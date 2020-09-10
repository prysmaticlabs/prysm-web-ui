import fromHexString from './from-hex-string';
import { hexlify } from 'ethers/lib/utils';

describe('fromHexString', () => {
  it('should do a proper round trip conversion', () => {
    const original = new Uint8Array([1, 2, 3, 4, 5, 6]);
    const hex = hexlify(original);
    const result = fromHexString(hex);
    expect(result.toString()).toEqual(original.toString());
  });
});