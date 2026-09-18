// @refresh reset

/**
 * @module JumpRightBackIn
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
 * For prop API + usage notes, read `JumpRightBackIn.md` in this folder
 * or run `npm run ld-kit -- show JumpRightBackIn`.
 */

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { LinkButton } from '../../components/LinkButton/LinkButton';
import { ItemTile, ItemTileBadgeType } from '../ItemTile';
import { PRODUCT_IMAGES } from '../../common/productImages';
import './JumpRightBackIn.css';

/* ------------------------------------------------------------------ */
/*  Inline drag-scroll hook                                            */
/* ------------------------------------------------------------------ */

const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - el.offsetLeft);
      setScrollLeft(el.scrollLeft);
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 2;
    };
    const onUp = () => {
      setIsDragging(false);
      el.style.cursor = 'grab';
      el.style.userSelect = 'auto';
    };
    const onLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        el.style.cursor = 'grab';
        el.style.userSelect = 'auto';
      }
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mouseleave', onLeave);
    el.style.cursor = 'grab';

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [isDragging, startX, scrollLeft]);

  return ref;
};

/* ------------------------------------------------------------------ */
/*  Data types                                                         */
/* ------------------------------------------------------------------ */

interface ProductCard {
  image: string;
  name: string;
  price: string;
  cents: string;
  originalPrice?: string;
  pricePrefix?: string;
  priceSuffix?: string;
  badge?: { label: string; type: ItemTileBadgeType };
}

interface Category {
  title: string;
  products: ProductCard[];
}

/* ------------------------------------------------------------------ */
/*  Hardcoded categories                                               */
/* ------------------------------------------------------------------ */

const CATEGORIES: Category[] = [
  {
    title: 'Trending',
    products: [
      {
        image: PRODUCT_IMAGES.countertopBlender,
        name: 'VAVSEA 3-in-1 Blender Sys...',
        price: '169',
        cents: '98',
        originalPrice: '$200.00',
        pricePrefix: 'Now',
        priceSuffix: '/mo',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.airFryer,
        name: 'Ninja 4 Qt Air Fryer,...',
        price: '98',
        cents: '00',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.tablet,
        name: 'Roku 50" Select Series TV',
        price: '228',
        cents: '00',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.digitalCamera,
        name: 'Vivitar Popnap Digital Ca...',
        price: '24',
        cents: '88',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
    ],
  },
  {
    title: "Fashion you'll love",
    products: [
      {
        image: PRODUCT_IMAGES.blackCardigan,
        name: "Athletic Works Women's...",
        price: '12',
        cents: '98',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.leatherHandbag,
        name: "Women's Leather Satchel...",
        price: '59',
        cents: '99',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.rattanCabinet,
        name: 'Rattan Storage Cabinet,...',
        price: '89',
        cents: '00',
        originalPrice: '$129.00',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.personalBlender,
        name: 'NutriBullet Pro 900W Ble...',
        price: '99',
        cents: '95',
        badge: { label: 'Popular pick', type: 'popular' },
      },
    ],
  },
  {
    title: 'Electronics',
    products: [
      {
        image: PRODUCT_IMAGES.tablet,
        name: 'Apple iPad Pro 11" M4 Chi...',
        price: '999',
        cents: '00',
        originalPrice: '$1,099.00',
        pricePrefix: 'Now',
        badge: { label: 'Deal', type: 'deal' },
      },
      {
        image: PRODUCT_IMAGES.digitalCamera,
        name: 'Canon EOS Rebel T7 DSL...',
        price: '479',
        cents: '00',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.airFryer,
        name: 'Ninja Foodi 6-in-1 Smart...',
        price: '149',
        cents: '99',
      },
      {
        image: PRODUCT_IMAGES.blenderSystem,
        name: 'Ninja Professional Plus B...',
        price: '278',
        cents: '00',
      },
    ],
  },
  {
    title: 'Up to 40% off home',
    products: [
      {
        image: PRODUCT_IMAGES.rattanCabinet,
        name: 'Beautiful 12 Piece Dinner...',
        price: '49',
        cents: '98',
        originalPrice: '$79.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.leatherHandbag,
        name: 'Decorative Throw Pillow...',
        price: '19',
        cents: '98',
      },
      {
        image: PRODUCT_IMAGES.blackCardigan,
        name: 'Better Homes & Gardens...',
        price: '34',
        cents: '97',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.cookwareSet,
        name: 'Keurig K-Express Coffee...',
        price: '59',
        cents: '00',
        originalPrice: '$79.00',
        pricePrefix: 'Now',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
    ],
  },
  {
    title: 'Top-rated picks',
    products: [
      {
        image: PRODUCT_IMAGES.comforterSet,
        name: 'Ultra Soft Comforter Set...',
        price: '49',
        cents: '98',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.cordlessVacuum,
        name: 'Cordless Stick Vacuum...',
        price: '89',
        cents: '99',
        originalPrice: '$129.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.mugSet,
        name: 'Stoneware Mug Set of 4',
        price: '28',
        cents: '00',
      },
      {
        image: PRODUCT_IMAGES.laptop1,
        name: 'Lenovo IdeaPad 15.6" Lap...',
        price: '329',
        cents: '00',
        originalPrice: '$399.00',
        pricePrefix: 'Now',
        badge: { label: 'Deal', type: 'deal' },
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function JumpRightBackIn() {
  const scrollRef = useDragScroll();

  return (
    <section className="ld-wcp-jump-right-back-in-root">
      {/* Header row */}
      <div className="ld-wcp-jump-right-back-in-header">
        <h2 className="ld-wcp-jump-right-back-in-title">
          Jump right back in
        </h2>
        <span className="ld-wcp-jump-right-back-in-viewall">
          <LinkButton href="#" size="small">
            View all
          </LinkButton>
        </span>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="ld-wcp-jump-right-back-in-scroll"
      >
        {CATEGORIES.map((category) => (
          <div key={category.title} className="ld-wcp-jump-right-back-in-category">
            {/* Category header */}
            <div className="ld-wcp-jump-right-back-in-category-header">
              <span className="ld-wcp-jump-right-back-in-category-title">
                {category.title}
              </span>
              <span className="ld-wcp-jump-right-back-in-shop-all">
                <LinkButton href="#" size="small">
                  Shop all
                </LinkButton>
              </span>
            </div>

            {/* 2x2 product grid */}
            <div className="ld-wcp-jump-right-back-in-grid">
              {category.products.map((product, i) => (
                <ItemTile key={i} {...product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
JumpRightBackIn.displayName = 'JumpRightBackIn';
