export default function range(start: number, end: number): number[] {
  if (end < start) {
    throw new Error('Upper limit cannot be smaller than lower limit');
  }
  return Array(end - start).fill(null).map((_, idx) => start + idx);
}