import { PRODUCTS } from '@/components/Hardware/data';

describe('Hardware data', () => {
  it('has exactly 4 products', () => {
    expect(PRODUCTS).toHaveLength(4);
  });

  it('each product has all required fields', () => {
    PRODUCTS.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('image');
    });
  });

  it('product ids are unique', () => {
    const ids = PRODUCTS.map(p => p.id);
    expect(new Set(ids).size).toBe(PRODUCTS.length);
  });

  it('all image URLs are non-empty strings', () => {
    PRODUCTS.forEach(product => {
      expect(typeof product.image).toBe('string');
      expect(product.image.length).toBeGreaterThan(0);
    });
  });

  it('contains the expected product titles', () => {
    const titles = PRODUCTS.map(p => p.title);
    expect(titles).toContain('NVIDIA VR200 NVL72');
    expect(titles).toContain('NVIDIA GB300 NVL72');
    expect(titles).toContain('NVIDIA HGX B300');
    expect(titles).toContain('NVIDIA HGX B200');
  });
});
