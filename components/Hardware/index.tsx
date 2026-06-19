'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PRODUCTS } from './data';

export default function HardwareSection() {
  const [activeId, setActiveId] = useState<number>(1);

  return (
    <section className="pt-xl pb-xl module-comp" aria-label="Hardware">
      <div className="sectionBorder" />
      <div className="container">
        <div className="stack--md">

          {/* ── Title block ── */}
          <div className="dark-mode titleBlock">
            <div className="positionRight">
              <div className="grid-x grid-margin-x align-middle">
                <div className="cell small-12 medium-7">
                  <h2 className="h2">The engines of superintelligence</h2>
                </div>
                <div className="cell small-12 medium-6 large-5">
                  <p className="richtext">
                    Give your team the computational precision to train foundation
                    models and serve inference at global scale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Horizontal accordion ── */}
          <div className="hardwareAccordionItems">
            {PRODUCTS.map(product => {
              const isActive = activeId === product.id;
              return (
                <button
                  key={product.id}
                  type="button"
                  className={`hardwareAccordionItem no-ui-button${isActive ? ' hardwareActive' : ''}`}
                  onClick={() => setActiveId(product.id)}
                  aria-expanded={isActive}
                >
                  {/* Product image */}
                  <div
                    className={`hardwareAccordionImage${isActive ? ' hardwareActiveImage' : ''}`}
                    style={{ backgroundColor: '#000' }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={600}
                      height={400}
                      className="hardwareAccordionImg"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Inner wrapper */}
                  <div className="hardwareAccordionItemInner">
                    <div
                      className={`hardwareAccordionTextContent${isActive ? ' hardwareActiveTextContent' : ''}`}
                      {...(!isActive ? { inert: true } : {})}
                    >
                      {/* Title — keep "HGX B300" / "HGX B200" on one line when inactive */}
                      <h3 className="hardwareAccordionItemTitle">
                        {!isActive && product.title.startsWith('NVIDIA HGX') ? (
                          <>
                            {'NVIDIA '}
                            <span className="no-wrap">
                              {product.title.slice('NVIDIA '.length)}
                            </span>
                          </>
                        ) : (
                          product.title
                        )}
                      </h3>

                      {/* Description */}
                      <div
                        className={`hardwareAccordionItemRichText${isActive ? ' hardwareActiveRichText' : ''}`}
                      >
                        {product.description}
                      </div>
                    </div>
                  </div>

                  {/* Bottom indicator bar */}
                  <span
                    className={`hardwareAccordionItemIndicator${isActive ? ' hardwareActiveIndicator' : ''}`}
                  />
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
