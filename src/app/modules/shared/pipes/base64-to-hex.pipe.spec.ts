import { Base64ToHexPipe } from './base64-to-hex.pipe';

describe('Base64ToHexPipe', () => {
  it('properly transforms a base64 string to its hex string representation', () => {
    const pipe = new Base64ToHexPipe();
    const original = 'AIIuAOw9jsxQ4De3rj66VIZIDR7EmvrWmg12v9sVjq2bw4no3v7ywHbQgDcb8fD+/A==';
    expect(pipe.transform(original)).toEqual('0x00822e00ec3d8ecc50e037b7ae3eba5486480d1ec49afad69a0d76bfdb158ead9bc389e8defef2c076d080371bf1f0fefc');
  });
});
