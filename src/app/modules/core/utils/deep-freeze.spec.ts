import deepFreeze from './deep-freeze';

describe('Deep freeze', () => {
  it(`should not allow modification of a frozen object's properties`, () => {
    const unfrozen = {
      title: 'Foo',
      subtitle: 'Bar',
    };
    unfrozen.title = 'Hello world';
    expect(unfrozen.title).toEqual('Hello world');
    const frozen = deepFreeze(unfrozen);
    const modify = () => {
      try {
        frozen.title = 'Hello world'
      } catch (err) {
        throw(err);
      }
    };
    expect(modify).toThrowError();
  });
  it(`should disallow deep modification of inner objects`, () => {
    const unfrozen = {
      title: 'Foo',
      subtitle: 'Bar',
      details: {
        reviews: 5,
      },
    };
    unfrozen.title = 'Hello world';
    expect(unfrozen.title).toEqual('Hello world');
    unfrozen.details.reviews = 10;
    expect(unfrozen.details.reviews).toEqual(10);
    const frozen = deepFreeze(unfrozen);
    const modifyDeep = () => {
      try {
        frozen.details.reviews = 1;
      } catch (err) {
        throw(err);
      }
    };
    expect(modifyDeep).toThrowError();
  });
});