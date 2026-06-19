import { render, screen } from '@testing-library/react';
import AiInfrastructureDiagram from '@/components/InfrastructureDiagram';

describe('AiInfrastructureDiagram', () => {
  it('renders without crashing', () => {
    render(<AiInfrastructureDiagram activeIndex={0} />);
  });

  it('renders an SVG element', () => {
    const { container } = render(<AiInfrastructureDiagram activeIndex={0} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders all 4 slab labels', () => {
    render(<AiInfrastructureDiagram activeIndex={0} />);
    expect(screen.getByText('Purpose-built datacenters')).toBeInTheDocument();
    expect(screen.getByText('AI infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Managed services')).toBeInTheDocument();
    expect(screen.getByText('Co-engineering')).toBeInTheDocument();
  });

  it('renders all 3 tier labels', () => {
    render(<AiInfrastructureDiagram activeIndex={0} />);
    expect(screen.getByText('AI DEVELOPERS')).toBeInTheDocument();
    expect(screen.getByText('ENTERPRISE')).toBeInTheDocument();
    expect(screen.getByText('SUPERINTELLIGENCE')).toBeInTheDocument();
  });

  it('accepts activeIndex 0 through 3 without throwing', () => {
    const { rerender } = render(<AiInfrastructureDiagram activeIndex={0} />);
    [1, 2, 3].forEach(i => {
      expect(() =>
        rerender(<AiInfrastructureDiagram activeIndex={i} />),
      ).not.toThrow();
    });
  });

  it('defaults activeIndex to 0 when not provided', () => {
    expect(() =>
      render(<AiInfrastructureDiagram />),
    ).not.toThrow();
  });
});
