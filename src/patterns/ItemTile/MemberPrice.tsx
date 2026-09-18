import * as React from 'react';
import {cx} from '../../common/cx';
import {Attribute} from '../../components/Attribute';
import {LockIcon} from '../../components/Icons';
import {getMedia} from '../../utils/mediaManager';
import './MemberPrice.css';

/**
 * Intentionally module-scoped and hardcoded to the `walmart-plus` tenant.
 *
 * MemberPrice is a W+ member pricing surface — the W+ logo mark is W+ brand
 * regardless of the active app theme. `getMedia` resolves synchronously from a
 * statically-imported barrel, so module-scope evaluation is safe and avoids
 * per-render overhead. A theme-reactive hook would be incorrect here: the logo
 * should not change when the host switches to e.g. Bodega or Sam's Club.
 */
const WPLUS_LOGO_SVG: string = getMedia('walmart-plus', 'Logo')?.svg ?? '';

export interface MemberPriceProps {
  /** Whole-dollar portion, e.g. "12" */
  price: string;
  /** Cents portion, e.g. "99" */
  cents: string;
  /** When true renders a price-lock indicator beneath the price row. */
  locked?: boolean;
  className?: string;
}

export const MemberPrice: React.FunctionComponent<MemberPriceProps> = ({
  price,
  cents,
  locked,
  className,
}) => (
  <div className={cx('ld-wcp-memberprice-root', className)}>
    <div className="ld-wcp-memberprice-row" aria-label={`Walmart Plus member price $${price}.${cents}`}>
      {WPLUS_LOGO_SVG
        ? <span className="ld-wcp-memberprice-logo" aria-hidden="true" dangerouslySetInnerHTML={{__html: WPLUS_LOGO_SVG}} />
        : null}
      <span className="ld-wcp-memberprice-dollarSign" aria-hidden="true">$</span>
      <span className="ld-wcp-memberprice-price" aria-hidden="true">{price}</span>
      <span className="ld-wcp-memberprice-cents" aria-hidden="true">{cents}</span>
      <span className="ld-wcp-memberprice-label" aria-hidden="true">with W+</span>
    </div>
    {locked && (
      <Attribute
        size="small"
        icon={<LockIcon size="small" />}
        label="Price lock"
        className="ld-wcp-memberprice-lock"
      />
    )}
  </div>
);

MemberPrice.displayName = 'MemberPrice';
