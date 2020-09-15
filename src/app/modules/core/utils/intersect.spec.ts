import intersect from './intersect';

describe('intersect', () => {
  it('intersect A(1) and B() should yield C()', () => {
    const a = new Set();
    const b = new Set();
    b.add(1);
    const expected = new Set();
    expect(intersect(a, b)).toEqual(expected);
  });
  it('intersect A(1) and B(1) should yield C(1)', () => {
    const a = new Set();
    const b = new Set();
    a.add(1);
    b.add(1);
    const expected = new Set();
    expected.add(1);
    expect(intersect(a, b)).toEqual(expected);
  });
  it('intersect A(1, 2) and B(3, 4) should yield C()', () => {
    const a = new Set();
    const b = new Set();
    a.add(1);
    a.add(2);
    b.add(3);
    b.add(4);
    const expected = new Set();
    expect(intersect(a, b)).toEqual(expected);
  });
  it('intersect A(1, 2) and B(2, 2) should yield C(2)', () => {
    const a = new Set();
    const b = new Set();
    a.add(1);
    a.add(2);
    b.add(2);
    b.add(3);
    const expected = new Set();
    expected.add(2);
    expect(intersect(a, b)).toEqual(expected);
  });
});
