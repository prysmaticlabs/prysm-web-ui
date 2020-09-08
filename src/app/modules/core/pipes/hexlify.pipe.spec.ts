import { HexlifyPipe } from './hexlify.pipe';

describe('UintArrayToHexStringPipe', () => {
  it('create an instance', () => {
    const pipe = new HexlifyPipe();
    /**
     * Test if pipe transforms the public key Uint8Array to the hex string representation
     **/
    var iterable = function* () { yield* [185, 8, 14, 131, 156, 242, 167, 72, 246, 66, 217, 7, 204, 81, 231, 69, 167, 72, 57, 39, 228, 188, 228, 19, 251, 0, 137, 151, 147, 78, 78, 106, 127, 156, 149, 138, 161, 45, 158, 171, 71, 29, 94, 89, 241, 15, 242, 23]; }();
    var uint8 = new Uint8Array(iterable);
    expect(pipe.transform(uint8)).toEqual('0xb9080e839cf2a748f642d907cc51e745a7483927e4bce413fb008997934e4e6a7f9c958aa12d9eab471d5e59f10ff217');
  });
});
