import { render, screen, fireEvent } from '@testing-library/react';
import HardwareSection from '@/components/Hardware';

describe('HardwareSection', () => {
  it('renders without crashing', () => {
    render(<HardwareSection />);
  });

  it('renders the section heading', () => {
    render(<HardwareSection />);
    expect(screen.getByText(/engines of superintelligence/i)).toBeInTheDocument();
  });

  it('renders all 4 product cards', () => {
    render(<HardwareSection />);
    expect(screen.getByText('NVIDIA VR200 NVL72')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA GB300 NVL72')).toBeInTheDocument();
    // HGX titles may be split across spans when inactive — use regex
    expect(screen.getByText(/HGX B300/)).toBeInTheDocument();
    expect(screen.getByText(/HGX B200/)).toBeInTheDocument();
  });

  it('first product is active (aria-expanded=true) by default', () => {
    render(<HardwareSection />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('other products are inactive by default', () => {
    render(<HardwareSection />);
    const buttons = screen.getAllByRole('button');
    buttons.slice(1).forEach(btn =>
      expect(btn).toHaveAttribute('aria-expanded', 'false'),
    );
  });

  it('clicking the second card makes it active', () => {
    render(<HardwareSection />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('active product shows its description', () => {
    render(<HardwareSection />);
    expect(
      screen.getByText(/Rack-scale systems optimized for agentic AI/i),
    ).toBeInTheDocument();
  });

  it('hides a product image when it fails to load', () => {
    render(<HardwareSection />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    fireEvent.error(images[0]);
    expect(images[0]).toHaveStyle({ display: 'none' });
  });
});
