// @refresh reset

/**
 * @module ContinueShopping
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
 * For prop API + usage notes, read `ContinueShopping.md` in this folder
 * or run `npm run ld-kit -- show ContinueShopping`.
 */

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { LinkButton } from '../../components/LinkButton/LinkButton';
import { ItemTile, ItemTileBadgeType } from '../ItemTile';
import { PRODUCT_IMAGES } from '../../common/productImages';
import './ContinueShopping.css';

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
    title: 'Handbags & accessories',
    products: [
      {
        image: PRODUCT_IMAGES.hoboBagGreen,
        name: 'Gaekeao Hobo Shoulder Bag',
        price: '34',
        cents: '99',
        originalPrice: '$49.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.brownTote,
        name: "Women's Leather Satchel...",
        price: '59',
        cents: '99',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.ivoryToteSet,
        name: 'MKP Collection Tote Bag Set',
        price: '44',
        cents: '99',
        originalPrice: '$64.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.hoboBagBrown,
        name: 'Classic Hobo Crossbody Bag',
        price: '29',
        cents: '98',
        badge: { label: 'Popular pick', type: 'popular' },
      },
    ],
  },
  {
    title: 'Furniture finds',
    products: [
      {
        image: PRODUCT_IMAGES.boucleArmchair,
        name: 'Boucle Accent Armchair',
        price: '159',
        cents: '00',
        originalPrice: '$219.00',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.pinkSofaBed,
        name: 'Adjustable Folding Sofa Bed...',
        price: '249',
        cents: '99',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.leatherArmchairDetail,
        name: 'Mid-Century Wood Armchair',
        price: '189',
        cents: '00',
        badge: { label: 'Popular pick', type: 'popular' },
      },
      {
        image: PRODUCT_IMAGES.leatherArmchair,
        name: 'Vintage Leather Accent Chair',
        price: '175',
        cents: '00',
        originalPrice: '$229.00',
        pricePrefix: 'Now',
        badge: { label: 'Deal', type: 'deal' },
      },
    ],
  },
  {
    title: 'Blenders & kitchen',
    products: [
      {
        image: PRODUCT_IMAGES.countertopBlender,
        name: 'VAVSEA Countertop Blender',
        price: '49',
        cents: '99',
        originalPrice: '$69.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.handBlenderSet,
        name: 'Immersion Hand Blender Set',
        price: '29',
        cents: '99',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.blenderSystem,
        name: 'Ninja DUO Blender & Pro...',
        price: '129',
        cents: '99',
        originalPrice: '$169.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.personalBlender,
        name: 'NutriBullet Personal Blender',
        price: '59',
        cents: '99',
      },
    ],
  },
  {
    title: 'Robot vacuums',
    products: [
      {
        image: PRODUCT_IMAGES.roomba1,
        name: 'iRobot Roomba i3+ Self-Em...',
        price: '299',
        cents: '99',
        originalPrice: '$449.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.roomba2,
        name: 'iRobot Roomba s9+ Robot...',
        price: '599',
        cents: '99',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.roomba3,
        name: 'iRobot Virtual Wall Barrier',
        price: '39',
        cents: '99',
      },
      {
        image: PRODUCT_IMAGES.roomba4,
        name: 'iRobot Roomba i3+ w/ Bas...',
        price: '349',
        cents: '00',
        originalPrice: '$499.00',
        pricePrefix: 'Now',
        badge: { label: 'Deal', type: 'deal' },
      },
    ],
  },
  {
    title: 'Laptops & tech',
    products: [
      {
        image: PRODUCT_IMAGES.laptop1,
        name: 'Lenovo IdeaPad 15.6" Laptop',
        price: '329',
        cents: '00',
        originalPrice: '$399.00',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.laptop2,
        name: 'Acer Chromebook 15.6", 8GB',
        price: '279',
        cents: '00',
        badge: { label: 'Best seller', type: 'bestseller' },
      },
      {
        image: PRODUCT_IMAGES.cordlessVacuum,
        name: 'Cordless Stick Vacuum Clea...',
        price: '89',
        cents: '99',
        originalPrice: '$129.99',
        pricePrefix: 'Now',
        badge: { label: 'Rollback', type: 'rollback' },
      },
      {
        image: PRODUCT_IMAGES.cookwareSet,
        name: 'Carote Nonstick Cookware...',
        price: '79',
        cents: '99',
        badge: { label: 'Popular pick', type: 'popular' },
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ContinueShopping() {
  const scrollRef = useDragScroll();

  return (
    <section className="ld-wcp-continue-shopping-root">
      {/* Header */}
      <div className="ld-wcp-continue-shopping-header">
        <h2 className="ld-wcp-continue-shopping-title">
          Continue shopping
        </h2>
        <span className="ld-wcp-continue-shopping-see-all">
          <LinkButton href="#" size="small">
            See all
          </LinkButton>
        </span>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="ld-wcp-continue-shopping-scroll-row"
      >
        {CATEGORIES.map((category) => (
          <div
            key={category.title}
            className="ld-wcp-continue-shopping-category-card"
          >
            {/* Category header */}
            <div className="ld-wcp-continue-shopping-category-header">
              <span className="ld-wcp-continue-shopping-category-title">
                {category.title}
              </span>
              <span className="ld-wcp-continue-shopping-shop-all">
                <LinkButton href="#" size="small">
                  Shop all
                </LinkButton>
              </span>
            </div>

            {/* 2x2 product grid */}
            <div className="ld-wcp-continue-shopping-product-grid">
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
ContinueShopping.displayName = 'ContinueShopping';
