import { ITEMS } from '@/components/Features/data';

describe('Features data', () => {
  it('has exactly 4 items', () => {
    expect(ITEMS).toHaveLength(4);
  });

  it('each item has all required fields', () => {
    ITEMS.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('number');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('body');
      expect(item).toHaveProperty('locked');
    });
  });

  it('item ids are unique', () => {
    const ids = ITEMS.map(i => i.id);
    expect(new Set(ids).size).toBe(ITEMS.length);
  });

  it('only the first item is locked', () => {
    expect(ITEMS[0].locked).toBe(true);
    ITEMS.slice(1).forEach(item => expect(item.locked).toBe(false));
  });

  it('numbers are "01" through "04"', () => {
    expect(ITEMS.map(i => i.number)).toEqual(['01', '02', '03', '04']);
  });
});
