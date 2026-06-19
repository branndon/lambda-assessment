'use client';

import HeroBackground from './HeroBackground';
import { useFontSwap } from './useFontSwap';
import { LINE1, LINE1_NOWRAP, LINE2 } from './constants';

/* ── Offsets for each word group within FULL_TEXT ── */
const OFF_LINE1   = 0;
const OFF_NOWRAP  = LINE1.length;
const OFF_LINE2   = LINE1.length + LINE1_NOWRAP.length + 1; // +1 for the space

function renderChar(ch: string, globalIdx: number, pixelSet: Set<number>) {
  if (ch === ' ') return <span key={globalIdx}>&nbsp;</span>;
  return (
    <span
      key={globalIdx}
      className="_fontSwapIsland_1e8ab_1"
      data-variant={pixelSet.has(globalIdx) ? 'highlight' : undefined}
    >
      {ch}
    </span>
  );
}

export default function HeroSection() {
  const pixelSet = useFontSwap();

  return (
    <section
      className="_homeHero_m4xpb_1 pt-xl pb-xl module-comp"
      id="section-home-hero"
      aria-label="Hero"
    >
      {/* ── Background canvas animation ── */}
      <HeroBackground />

      {/* ── Eyebrow ── */}
      <p className="_eyebrow_m4xpb_37">
        Supercomputers for training and inference
      </p>

      {/* ── Heading (reduced-motion fallback — visual only; sr-only in animated h1 is the AT source) ── */}
      <h1 className="h1-large _reducedMotionTitle_m4xpb_75" aria-hidden="true">
        <span>
          The Superintelligence
          <br />
          Cloud
        </span>
      </h1>

      {/* ── Heading (animated) ── */}
      <h1 className="h1-large _heroTitle_m4xpb_78">
        <span className="sr-only">The Superintelligence Cloud</span>
        <span aria-hidden="true">
          {LINE1.split('').map((ch, i) =>
            renderChar(ch, OFF_LINE1 + i, pixelSet),
          )}
          <span className="no-wrap">
            {LINE1_NOWRAP.split('').map((ch, i) =>
              renderChar(ch, OFF_NOWRAP + i, pixelSet),
            )}
          </span>
          <br />
          {LINE2.split('').map((ch, i) =>
            renderChar(ch, OFF_LINE2 + i, pixelSet),
          )}
        </span>
      </h1>

      {/* ── CTA buttons ── */}
      <div className="container _titleContainer_m4xpb_58">
        <div className="buttonGroup _buttonGroup_m4xpb_63" data-align="center">
          <a href="/sign-up" className="button" aria-label="Launch GPU instance">
            Launch GPU instance
          </a>
          <a
            href="/talk-to-our-team"
            className="button button--secondary"
            aria-label="Talk to our team"
          >
            Talk to our team
          </a>
        </div>
      </div>
    </section>
  );
}
