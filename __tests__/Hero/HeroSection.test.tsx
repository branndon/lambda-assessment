import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/Hero';

describe('HeroSection', () => {
  it('renders without crashing', () => {
    render(<HeroSection />);
  });

  it('renders the screen-reader heading', () => {
    render(<HeroSection />);
    expect(
      screen.getByText('The Superintelligence Cloud'),
    ).toBeInTheDocument();
  });

  it('renders the eyebrow text', () => {
    render(<HeroSection />);
    expect(
      screen.getByText('Supercomputers for training and inference'),
    ).toBeInTheDocument();
  });

  it('renders the "Launch GPU instance" CTA', () => {
    render(<HeroSection />);
    expect(
      screen.getByRole('link', { name: 'Launch GPU instance' }),
    ).toBeInTheDocument();
  });

  it('renders the "Talk to our team" CTA', () => {
    render(<HeroSection />);
    expect(
      screen.getByRole('link', { name: 'Talk to our team' }),
    ).toBeInTheDocument();
  });

  it('CTA links point to the correct hrefs', () => {
    render(<HeroSection />);
    expect(screen.getByRole('link', { name: 'Launch GPU instance' })).toHaveAttribute(
      'href', '/sign-up',
    );
    expect(screen.getByRole('link', { name: 'Talk to our team' })).toHaveAttribute(
      'href', '/talk-to-our-team',
    );
  });

  it('renders the background canvas element', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
