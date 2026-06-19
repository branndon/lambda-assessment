'use client';

import { useState } from 'react';
import AiInfrastructureDiagram from '../InfrastructureDiagram';
import { ITEMS } from './data';

export default function FeaturesSection() {
  const [openId, setOpenId] = useState<number>(1);

  const toggle = (id: number, locked: boolean) => {
    if (locked && openId === id) return;
    setOpenId(prev => (prev === id ? 1 : id));
  };

  return (
    <section className="pt-xl pb-xl module-comp" aria-label="Features">
      <div className="sectionBorder" />
      <div className="container">
        <div className="stack--md">

          {/* ── Section heading ── */}
          <div className="dark-mode titleBlock">
            <div className="grid-x grid-margin-x">
              <div className="cell small-12 medium-7">
                <h2 className="h2">Built for AI. Ready for superintelligence.</h2>
                <div className="content noContent" />
              </div>
            </div>
          </div>

          {/* ── Two-column grid ── */}
          <div className="grid-x grid-margin-x">

            {/* Left: accordion */}
            <div className="cell small-12 medium-7">
              <div className="accordion">
                {ITEMS.map(item => {
                  const isOpen = openId === item.id;
                  return (
                    <div key={item.id} className="accordionItem">

                      {/* Number */}
                      <div className="accordionItemNumberColumn">
                        <span
                          className={[
                            'h5',
                            '_accordionActiveItemNumber_1wr90_1',
                            isOpen ? '_active_1wr90_5' : '',
                          ].filter(Boolean).join(' ')}
                          aria-hidden="true"
                        >
                          {item.number}
                        </span>
                      </div>

                      {/* Content column */}
                      <div className="accordionItemContentColumn">
                        <h3 className="accordionItemHeader">
                          <button
                            id={`accordion-btn-${item.id}`}
                            type="button"
                            className="accordionItemHeaderButton"
                            aria-expanded={isOpen}
                            aria-controls={`accordion-panel-${item.id}`}
                            data-locked={item.locked ? 'true' : undefined}
                            onClick={() => toggle(item.id, item.locked)}
                          >
                            <span className="accordionItemTitle">{item.title}</span>
                            <span className="accordionToggle" aria-hidden="true">
                              {isOpen ? '−' : '+'}
                            </span>
                          </button>
                        </h3>

                        <div
                          id={`accordion-panel-${item.id}`}
                          className={`accordionItemContent${isOpen ? ' accordionItemContentOpen' : ''}`}
                          role="region"
                          aria-labelledby={`accordion-btn-${item.id}`}
                          {...(!isOpen ? { inert: true } : {})}
                        >
                          <div className="accordionItemRich">
                            <div>{item.body}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: isometric illustration */}
            <div className="cell small-12 medium-5">
              <div className="_animationContainer_1wr90_9">
                <AiInfrastructureDiagram activeIndex={openId - 1} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
