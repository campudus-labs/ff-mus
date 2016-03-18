import assert from 'assert';

describe('test-setup', () => {

  it('works', () => {
    assert(true);
  });

  it('has promises enabled', () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
  });

  it('has const and let enabled', () => {
    const a = 1;
    let b = 0;
    assert(a + b === a);
    b = 1;
    assert(a * b === a);
  });

});
