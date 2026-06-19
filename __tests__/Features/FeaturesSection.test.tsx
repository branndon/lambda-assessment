import { render, screen, fireEvent } from '@testing-library/react';
import FeaturesSection from '@/components/Features';

describe('FeaturesSection', () => {
  it('renders without crashing', () => {
    render(<FeaturesSection />);
  });

  it('renders the section heading', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Built for AI/i)).toBeInTheDocument();
  });

  it('renders all 4 accordion titles', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/You bring models/i)).toBeInTheDocument();
    expect(screen.getByText(/Your supercomputer/i)).toBeInTheDocument();
    expect(screen.getByText(/Orchestration, handled/i)).toBeInTheDocument();
    expect(screen.getByText(/Experts included/i)).toBeInTheDocument();
  });

  it('item 1 is expanded by default', () => {
    render(<FeaturesSection />);
    const firstButton = screen.getByRole('button', { name: /You bring models/i });
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('other items are collapsed by default', () => {
    render(<FeaturesSection />);
    const secondButton = screen.getByRole('button', { name: /Your supercomputer/i });
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking item 2 expands it', () => {
    render(<FeaturesSection />);
    const button = screen.getByRole('button', { name: /Your supercomputer/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('opening item 2 shows its body text', () => {
    render(<FeaturesSection />);
    fireEvent.click(screen.getByRole('button', { name: /Your supercomputer/i }));
    expect(screen.getByText(/Train foundation models/i)).toBeInTheDocument();
  });

  it('clicking the already-open locked item (item 1) does not collapse it', () => {
    render(<FeaturesSection />);
    const lockedButton = screen.getByRole('button', { name: /You bring models/i });
    // Item 1 starts open
    expect(lockedButton).toHaveAttribute('aria-expanded', 'true');
    // Click it — should stay open because it is locked
    fireEvent.click(lockedButton);
    expect(lockedButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('accordion button is linked to its panel via aria-controls', () => {
    render(<FeaturesSection />);
    const btn = screen.getByRole('button', { name: /Your supercomputer/i });
    const panelId = btn.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toBeInTheDocument();
  });

  it('accordion panel has aria-labelledby pointing to its button', () => {
    render(<FeaturesSection />);
    const btn     = screen.getByRole('button', { name: /Your supercomputer/i });
    const panelId = btn.getAttribute('aria-controls')!;
    const panel   = document.getElementById(panelId)!;
    expect(panel.getAttribute('aria-labelledby')).toBe(btn.id);
  });
});
