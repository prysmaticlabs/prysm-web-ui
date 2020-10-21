import { SlotPipe } from './format-slot.pipe';

describe('SlotPipe', () => {
  it('properly transforms a positive slot number to its string representation', () => {
    const pipe = new SlotPipe();
    const original = 1;
    expect(pipe.transform(original)).toEqual('1');
  });
  it('properly transforms a negative slot number to its string representation \'awaiting genesis\'', () => {
    const pipe = new SlotPipe();
    const original = -1;
    expect(pipe.transform(original)).toEqual('awaiting genesis');
  });
});
