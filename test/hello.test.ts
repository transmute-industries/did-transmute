import { hello } from '../src'

describe('module', () => {
  it('hello', () => {
    const data = hello()
    expect(data).toEqual('world')
  });
});