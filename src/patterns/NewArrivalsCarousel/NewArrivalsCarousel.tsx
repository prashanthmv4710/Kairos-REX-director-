// @refresh reset

/**
 * @module NewArrivalsCarousel
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `NewArrivalsCarousel.md` in this folder
 * or run `npm run ld-kit -- show NewArrivalsCarousel`.
 */

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../../components/Button';
import { ChevronLeftIcon, ChevronRightIcon, Icon } from '../../components/Icons';
import { PRODUCT_IMAGES } from '../../common/productImages';
import './NewArrivalsCarousel.css';

/* ------------------------------------------------------------------ */
/*  Play / pause controls — theme font icons                           */
/* ------------------------------------------------------------------ */

const PauseIcon = () => <Icon name="Pause" style={{fontSize: 12}} decorative />;

const PlayIcon = () => <Icon name="Play" style={{fontSize: 12}} decorative />;

/* ------------------------------------------------------------------ */
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

export interface CarouselSlide {
  image: string;
  bgColor: string;
  eyebrow: string;
  headline: string;
  headlineParts?: string[];
  ctaText: string;
  objectPosition?: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    image: PRODUCT_IMAGES.walmartPlaceholder,
    bgColor: '#2D5F2D',
    eyebrow: 'Up to 40% off red, white & so you',
    headline: 'Last-minute July 4th faves',
    ctaText: 'Shop now',
    objectPosition: 'center center',
  },
];

export interface NewArrivalsCarouselProps {
  slides?: CarouselSlide[];
}

const INTERVAL_MS = 4000;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function NewArrivalsCarousel({ slides }: NewArrivalsCarouselProps = {}) {
  const allSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % allSlides.length);
  }, [allSlides.length]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, advance]);

  const slide = allSlides[current];

  const headlineContent = slide.headlineParts
    ? slide.headlineParts.map((part, i) => (
        <span key={i} className="ld-wcp-new-arrivals-carousel-headline-part">
          {part}
        </span>
      ))
    : slide.headline;

  return (
    <div
      className="ld-wcp-new-arrivals-carousel-root"
      style={{ backgroundColor: slide.bgColor }}
    >
      {/* Background image */}
      <img
        src={slide.image}
        alt={slide.headline}
        className="ld-wcp-new-arrivals-carousel-image"
        style={{ objectPosition: slide.objectPosition ?? 'center center' }}
      />

      {/* Text panel — top-left */}
      <div className="ld-wcp-new-arrivals-carousel-text-panel">
        <div className="ld-wcp-new-arrivals-carousel-eyebrow">
          {slide.eyebrow}
        </div>
        <div className="ld-wcp-new-arrivals-carousel-headline">
          {headlineContent}
        </div>
        <div>
          <Button variant="secondary" size="small">
            {slide.ctaText}
          </Button>
        </div>
      </div>

      {/* Controls — top-right, small white buttons */}
      <div className="ld-wcp-new-arrivals-carousel-controls">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => {
            setCurrent((c) => (c - 1 + allSlides.length) % allSlides.length);
            setIsPaused(true);
          }}
          className="ld-wcp-new-arrivals-carousel-control-btn"
        >
          <ChevronLeftIcon size="small" />
        </button>
        <button
          type="button"
          aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
          onClick={() => setIsPaused((p) => !p)}
          className="ld-wcp-new-arrivals-carousel-control-btn"
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => {
            setCurrent((c) => (c + 1) % allSlides.length);
            setIsPaused(true);
          }}
          className="ld-wcp-new-arrivals-carousel-control-btn"
        >
          <ChevronRightIcon size="small" />
        </button>
      </div>
    </div>
  );
}
NewArrivalsCarousel.displayName = 'NewArrivalsCarousel';
