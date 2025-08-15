import { Button, Autocomplete } from '../index';

describe('ui index', () => {
  it('экспортирует Button', () => {
    expect(Button).toBeDefined();
  });

  it('экспортирует Autocomplete', () => {
    expect(Autocomplete).toBeDefined();
  });
});
