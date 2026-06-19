import {
  project,
  polygon,
  SLAB_NAMES,
  TIER_LABELS,
  V_STEP,
  ISO_OX,
  ISO_OY,
} from '@/components/InfrastructureDiagram/utils';

describe('project()', () => {
  it('returns a tuple of two numbers', () => {
    const result = project(0, 0, 0);
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('origin (0,0,0) maps to ISO_OX / ISO_OY', () => {
    const [x, y] = project(0, 0, 0);
    expect(x).toBe(ISO_OX);
    expect(y).toBe(ISO_OY);
  });

  it('increasing layer shifts y downward', () => {
    const [, y0] = project(0, 0, 0);
    const [, y1] = project(0, 0, 1);
    expect(y1).toBeCloseTo(y0 + V_STEP);
  });

  it('row offset shifts x right and y down', () => {
    const [x0, y0] = project(0, 0, 0);
    const [x1, y1] = project(1, 0, 0);
    expect(x1).toBeGreaterThan(x0);
    expect(y1).toBeGreaterThan(y0);
  });

  it('col offset shifts x left and y down', () => {
    const [x0, y0] = project(0, 0, 0);
    const [x1, y1] = project(0, 1, 0);
    expect(x1).toBeLessThan(x0);
    expect(y1).toBeGreaterThan(y0);
  });
});

describe('polygon()', () => {
  it('returns a string', () => {
    expect(typeof polygon([[0, 0], [1, 1]])).toBe('string');
  });

  it('formats coordinates as "x,y" pairs separated by spaces', () => {
    expect(polygon([[0, 0], [10, 20]])).toBe('0,0 10,20');
  });

  it('handles a single point', () => {
    expect(polygon([[5, 7]])).toBe('5,7');
  });
});

describe('SLAB_NAMES', () => {
  it('has exactly 4 entries', () => {
    expect(SLAB_NAMES).toHaveLength(4);
  });

  it('contains the expected layer names', () => {
    expect(SLAB_NAMES).toContain('Purpose-built datacenters');
    expect(SLAB_NAMES).toContain('AI infrastructure');
    expect(SLAB_NAMES).toContain('Managed services');
    expect(SLAB_NAMES).toContain('Co-engineering');
  });
});

describe('TIER_LABELS', () => {
  it('has exactly 3 entries', () => {
    expect(TIER_LABELS).toHaveLength(3);
  });

  it('each entry has text and pos fields', () => {
    TIER_LABELS.forEach(label => {
      expect(label).toHaveProperty('text');
      expect(label).toHaveProperty('pos');
      expect(typeof label.pos).toBe('number');
    });
  });
});
