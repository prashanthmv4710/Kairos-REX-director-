// @refresh reset

/**
 * @module RatingStars
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
 * For prop API + usage notes, read `RatingStars.md` in this folder
 * or run `npm run ld-kit -- show RatingStars`.
 */

/**
 * RatingStars
 *
 * @deprecated Use `Rating` from `'../Rating/Rating'` instead. `RatingStars`
 * was a duplicate implementation of the same interactive star rating
 * (identical types, labels, and behavior). This module is now a thin
 * re-export that forwards to `Rating` so existing imports keep working;
 * delete the import path in a future major release.
 */
export {Rating as RatingStars} from '../Rating/Rating';
export type {RatingProps as RatingStarsProps, RatingSize as RatingStarsSize} from '../Rating/Rating';
