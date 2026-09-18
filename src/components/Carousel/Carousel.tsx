// @refresh reset

/**
 * @module Carousel
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
 * For prop API + usage notes, read `Carousel.md` in this folder
 * or run `npm run ld-kit -- show Carousel`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps, mergeRefs} from '../../common/helpers';
import type {CommonProps} from '../../common/helpers';
import {Button} from '../Button/Button';
import './Carousel.css';

// ---------------------------------------------------------------------------
// Inline SVG Icons
// ---------------------------------------------------------------------------

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CarouselContextValue {
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  activeIndex: number;
  totalSlides: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  orientation: 'horizontal' | 'vertical';
  carouselLabel?: string;
}

const CarouselCtx = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselCtx);
  if (!ctx) throw new Error('useCarousel must be used within a <Carousel />');
  return ctx;
}

// ---------------------------------------------------------------------------
// Carousel (root)
// ---------------------------------------------------------------------------

export interface CarouselProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (props, ref) => {
    const {children, className, orientation = 'horizontal', 'aria-label': carouselLabel, ...rest} = applyCommonProps(props) as ReturnType<typeof applyCommonProps> & CarouselProps & {'aria-label'?: string};
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [totalSlides, setTotalSlides] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const updateScrollState = React.useCallback(() => {
      const el = scrollAreaRef.current;
      if (!el) return;
      const slides = el.querySelectorAll<HTMLElement>('[data-carousel-item]');
      setTotalSlides(slides.length);

      if (slides.length === 0) return;

      const containerRect = el.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      let closestIdx = 0;
      let closestDist = Infinity;

      slides.forEach((slide, idx) => {
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const dist = Math.abs(slideCenter - containerCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);

      const scrollLeft = el.scrollLeft;
      const maxScroll = el.scrollWidth - el.clientWidth;
      setCanScrollPrev(scrollLeft > 1);
      setCanScrollNext(scrollLeft < maxScroll - 1);
    }, []);

    React.useEffect(() => {
      const el = scrollAreaRef.current;
      if (!el) return;

      updateScrollState();

      const handleScroll = () => {
        updateScrollState();
      };

      el.addEventListener('scroll', handleScroll, {passive: true});

      const resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }, [updateScrollState]);

    React.useEffect(() => {
      const timer = setTimeout(updateScrollState, 50);
      return () => clearTimeout(timer);
    }, [children, updateScrollState]);

    const scrollTo = React.useCallback((index: number) => {
      const el = scrollAreaRef.current;
      if (!el) return;
      const slides = el.querySelectorAll<HTMLElement>('[data-carousel-item]');
      if (index < 0 || index >= slides.length) return;
      slides[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }, []);

    const scrollPrev = React.useCallback(() => {
      scrollTo(activeIndex - 1);
    }, [activeIndex, scrollTo]);

    const scrollNext = React.useCallback(() => {
      scrollTo(activeIndex + 1);
    }, [activeIndex, scrollTo]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    const ctxValue = React.useMemo<CarouselContextValue>(
      () => ({
        scrollAreaRef,
        activeIndex,
        totalSlides,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
        orientation,
        carouselLabel,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [activeIndex, totalSlides, canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo, orientation, carouselLabel],
    );

    return (
      <CarouselCtx.Provider value={ctxValue}>
        <div
          ref={ref}
          className={cx('ld-carousel-root', className)}
          onKeyDownCapture={handleKeyDown}
          {...rest}
        >
          {children}
        </div>
      </CarouselCtx.Provider>
    );
  },
);

Carousel.displayName = 'Carousel';

// ---------------------------------------------------------------------------
// CarouselContent (scrollable container)
// ---------------------------------------------------------------------------

export interface CarouselContentProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
}

export const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  (props, ref) => {
    const {children, className, ...rest} = applyCommonProps(props);
    const {scrollAreaRef, orientation, carouselLabel} = useCarousel();

    return (
      <div className="ld-carousel-viewport">
        <div
          ref={mergeRefs(scrollAreaRef, ref)}
          className={cx(
            'ld-carousel-content',
            orientation === 'vertical' && 'ld-carousel-content--vertical',
            className,
          )}
          role="region"
          aria-roledescription="carousel"
          aria-label={carouselLabel}
          tabIndex={0}
          {...rest}
        >
          {children}
        </div>
      </div>
    );
  },
);

CarouselContent.displayName = 'CarouselContent';

// ---------------------------------------------------------------------------
// CarouselItem (slide)
// ---------------------------------------------------------------------------

export interface CarouselItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
  /**
   * Number of columns this item occupies, setting a responsive flex-basis.
   * - `1` — full viewport width (one card visible at a time)
   * - `2` — half width (two cards visible); collapses to full width on mobile
   * - `3` — one-third width (three cards visible); collapses to full width on mobile
   *
   * When omitted the item uses its natural content width (set via `UNSAFE_style`).
   */
  cols?: 1 | 2 | 3;
}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  (props, ref) => {
    const {children, className, cols, ...rest} = applyCommonProps(props);

    return (
      <div
        ref={ref}
        data-carousel-item=""
        role="group"
        aria-roledescription="slide"
        className={cx(
          'ld-carousel-item',
          cols === 1 && 'ld-carousel-item--cols-1',
          cols === 2 && 'ld-carousel-item--cols-2',
          cols === 3 && 'ld-carousel-item--cols-3',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CarouselItem.displayName = 'CarouselItem';

// ---------------------------------------------------------------------------
// CarouselPrevious
// ---------------------------------------------------------------------------

export interface CarouselPreviousProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style'>,
    CommonProps {}

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  (props, ref) => {
    const {className, ...rest} = applyCommonProps(props);
    const {scrollPrev, canScrollPrev} = useCarousel();

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Previous slide"
        disabled={!canScrollPrev}
        className={cx('ld-carousel-btn', 'ld-carousel-btn--prev', className)}
        onClick={scrollPrev}
        {...rest}
      >
        <ChevronLeftIcon />
      </button>
    );
  },
);

CarouselPrevious.displayName = 'CarouselPrevious';

// ---------------------------------------------------------------------------
// CarouselNext
// ---------------------------------------------------------------------------

export interface CarouselNextProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style'>,
    CommonProps {}

export const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  (props, ref) => {
    const {className, ...rest} = applyCommonProps(props);
    const {scrollNext, canScrollNext} = useCarousel();

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Next slide"
        disabled={!canScrollNext}
        className={cx('ld-carousel-btn', 'ld-carousel-btn--next', className)}
        onClick={scrollNext}
        {...rest}
      >
        <ChevronRightIcon />
      </button>
    );
  },
);

CarouselNext.displayName = 'CarouselNext';

// ---------------------------------------------------------------------------
// CarouselPagination (dot indicators)
// ---------------------------------------------------------------------------

export interface CarouselPaginationProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {}

export const CarouselPagination: React.FunctionComponent<CarouselPaginationProps> = (props) => {
  const {className, ...rest} = applyCommonProps(props);
  const {activeIndex, totalSlides, scrollTo} = useCarousel();

  if (totalSlides <= 1) return null;

  return (
    <div className={cx('ld-carousel-pagination', className)} role="tablist" {...rest}>
      {Array.from({length: totalSlides}, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Go to slide ${i + 1}`}
          className={cx(
            'ld-carousel-dot',
            i === activeIndex && 'ld-carousel-dot--active',
          )}
          onClick={() => scrollTo(i)}
        />
      ))}
    </div>
  );
};

CarouselPagination.displayName = 'CarouselPagination';

// ---------------------------------------------------------------------------
// CarouselSection (title header + optional actions/nav)
// ---------------------------------------------------------------------------

export interface CarouselSectionProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'title'>,
    CommonProps {
  children: React.ReactNode;
  /** Section title text */
  title?: React.ReactNode;
  /** Slot for actions placed at the end of the header, e.g. a \"View All\" link or header nav buttons */
  actions?: React.ReactNode;
}

/**
 * A layout wrapper that adds a section heading row above the carousel.
 * Place `CarouselHeaderPrevious` / `CarouselHeaderNext` in the `actions`
 * slot for an inline icon-button navigation variant.
 */
export const CarouselSection = React.forwardRef<HTMLDivElement, CarouselSectionProps>(
  (props, ref) => {
    const {children, className, title, actions, ...rest} = applyCommonProps(props);

    if (!title && !actions) {
      return (
        <div ref={ref} className={cx('ld-carousel-section', className)} {...rest}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cx('ld-carousel-section', className)} {...rest}>
        <div className="ld-carousel-section-header">
          {title && <p className="ld-carousel-section-title">{title}</p>}
          {actions && <div className="ld-carousel-section-actions">{actions}</div>}
        </div>
        {children}
      </div>
    );
  },
);

CarouselSection.displayName = 'CarouselSection';

// ---------------------------------------------------------------------------
// CarouselHeaderPrevious / CarouselHeaderNext
// (small round buttons for use inside a section header)
// ---------------------------------------------------------------------------

export interface CarouselHeaderPreviousProps extends CommonProps {
  /** Forwarded to the underlying Button. */
  disabled?: boolean;
}

/** Ghost icon button for navigating to the previous slide, sized for a section header. */
export const CarouselHeaderPrevious = React.forwardRef<HTMLButtonElement, CarouselHeaderPreviousProps>(
  (props, ref) => {
    const {disabled, ...rest} = applyCommonProps(props);
    const {scrollPrev, canScrollPrev} = useCarousel();

    return (
      <Button
        ref={ref}
        variant="ghost"
        shape="square"
        size="small"
        aria-label="Previous slide"
        disabled={disabled ?? !canScrollPrev}
        onClick={scrollPrev}
        {...rest}
      >
        <ChevronLeftIcon width="16" height="16" />
      </Button>
    );
  },
);

CarouselHeaderPrevious.displayName = 'CarouselHeaderPrevious';

export interface CarouselHeaderNextProps extends CommonProps {
  /** Forwarded to the underlying Button. */
  disabled?: boolean;
}

/** Ghost icon button for navigating to the next slide, sized for a section header. */
export const CarouselHeaderNext = React.forwardRef<HTMLButtonElement, CarouselHeaderNextProps>(
  (props, ref) => {
    const {disabled, ...rest} = applyCommonProps(props);
    const {scrollNext, canScrollNext} = useCarousel();

    return (
      <Button
        ref={ref}
        variant="ghost"
        shape="square"
        size="small"
        aria-label="Next slide"
        disabled={disabled ?? !canScrollNext}
        onClick={scrollNext}
        {...rest}
      >
        <ChevronRightIcon width="16" height="16" />
      </Button>
    );
  },
);

CarouselHeaderNext.displayName = 'CarouselHeaderNext';

// ---------------------------------------------------------------------------
// Inline SVG Icons (for progress bar)
// ---------------------------------------------------------------------------

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 2.5L11 7L3 11.5V2.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}

function SmallChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2L4.5 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SmallChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 2L9.5 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CarouselProgressBar (progress bar pagination with auto-play controls)
// ---------------------------------------------------------------------------

export interface CarouselProgressBarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  /** Enable auto-play on mount. Default: false */
  autoPlay?: boolean;
  /** Auto-play interval in milliseconds. Default: 3000 */
  autoPlayInterval?: number;
  /** Show dot indicators on the progress bar. Default: true */
  showDots?: boolean;
}

export const CarouselProgressBar: React.FunctionComponent<CarouselProgressBarProps> = (props) => {
  const {
    className,
    autoPlay = false,
    autoPlayInterval = 3000,
    showDots = false,
    ...rest
  } = applyCommonProps(props);
  const {activeIndex, totalSlides, scrollPrev, scrollNext, scrollTo, canScrollPrev, canScrollNext} = useCarousel();
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const timerRef = React.useRef<number | undefined>(undefined);

  const autoAdvanceRef = React.useRef<() => void>(() => {});
  React.useEffect(() => {
    autoAdvanceRef.current = () => {
      if (canScrollNext) {
        scrollNext();
      } else {
        scrollTo(0);
      }
    };
  }, [canScrollNext, scrollNext, scrollTo]);

  React.useEffect(() => {
    if (!isPlaying) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => {
      autoAdvanceRef.current();
    }, autoPlayInterval);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, autoPlayInterval]);

  if (totalSlides <= 1) return null;

  const progress = totalSlides > 1 ? activeIndex / (totalSlides - 1) : 0;

  return (
    <div
      className={cx('ld-carousel-progressbar', className)}
      aria-label="Carousel controls"
      {...rest}
    >
      <button
        type="button"
        className="ld-carousel-progressbar-btn"
        onClick={() => setIsPlaying((v) => !v)}
        aria-label={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        type="button"
        className="ld-carousel-progressbar-btn"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
      >
        <SmallChevronLeftIcon />
      </button>

      <button
        type="button"
        className="ld-carousel-progressbar-btn"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next slide"
      >
        <SmallChevronRightIcon />
      </button>

      {/* Column wrapper keeps track bar and dot buttons vertically aligned.
          role="progressbar" is placed on the track only — dot buttons are siblings
          outside the progressbar so they don't violate nested-interactive. */}
      <div className="ld-carousel-progressbar-track-wrapper">
        <div
          role="progressbar"
          aria-valuenow={activeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalSlides}
          aria-label={`Slide ${activeIndex + 1} of ${totalSlides}`}
          className="ld-carousel-progressbar-track"
        >
          <div
            className="ld-carousel-progressbar-fill"
            style={{width: `${progress * 100}%`}}
          />
        </div>

        {showDots && totalSlides > 0 && (
          <div className="ld-carousel-progressbar-dots">
            {Array.from({length: totalSlides}, (_, i) => (
              <button
                key={i}
                type="button"
                className={cx(
                  'ld-carousel-progressbar-dot',
                  i === activeIndex && 'ld-carousel-progressbar-dot--active',
                )}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

CarouselProgressBar.displayName = 'CarouselProgressBar';
