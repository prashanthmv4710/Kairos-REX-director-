/**
 * Carousels & Grids pattern — barrel that re-exports the four canned product
 * carousels for "Walmart homepage"-style layouts. Each carousel keeps its own
 * data shape and API; this barrel just gives consumers one import line.
 *
 *   import {
 *     FlashDealsCarousel,
 *     NewArrivalsCarousel,
 *     ContinueShopping,
 *     JumpRightBackIn,
 *   } from '@livingdesign/react/patterns/CarouselsAndGrids';
 */
export * from '../FlashDealsCarousel';
export * from '../NewArrivalsCarousel';
export * from '../ContinueShopping';
export * from '../JumpRightBackIn';
