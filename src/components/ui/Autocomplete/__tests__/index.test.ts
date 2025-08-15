import { Autocomplete, AutocompleteItem, AutocompleteList } from '../index';

describe('Autocomplete index', () => {
  it('экспортирует Autocomplete', () => {
    expect(Autocomplete).toBeDefined();
  });

  it('экспортирует AutocompleteItem', () => {
    expect(AutocompleteItem).toBeDefined();
  });

  it('экспортирует AutocompleteList', () => {
    expect(AutocompleteList).toBeDefined();
  });
});
