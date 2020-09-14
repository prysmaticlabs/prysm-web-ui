import { base64ToHex, hexToBase64 } from './hex-util';

describe('fromHexString, hexToBase64', () => {
  it('should do a proper round trip conversion', () => {
    const original = 'AIIuAOw9jsxQ4De3rj66VIZIDR7EmvrWmg12v9sVjq2bw4no3v7ywHbQgDcb8fD+/A==';
    const hex = base64ToHex(original);
    expect(hex).toEqual('0x00822e00ec3d8ecc50e037b7ae3eba5486480d1ec49afad69a0d76bfdb158ead9bc389e8defef2c076d080371bf1f0fefc');
    const base64 = hexToBase64(hex);
    expect(base64).toEqual(original);
  });
});