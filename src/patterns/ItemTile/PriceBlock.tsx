import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Attribute, type AttributeColor} from '../../components/Attribute';
import {Flag} from '../../components/Flag';
import {VisuallyHidden} from '../../components/VisuallyHidden';
import {getMedia, useThemeMediaTenant} from '../../utils/mediaManager';
import './PriceBlock.css';

export interface PriceBlockProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /** Whole-dollar portion of the main price, e.g. "12" */
  price: string;
  /** Cents portion of the main price, e.g. "99" */
  cents: string;
  /**
   * Prefix label before the price.
   * - `"Now"` → savings state: green row color
   * - `"From"` → regular state: default text color
   */
  prefix?: string;
  /** Suffix label after cents, e.g. "/lb" */
  suffix?: string;
  /** Strike-through was-price, e.g. "$14.99" */
  originalPrice?: string;
  /**
   * Subtle caption that trails the strikethrough original price inline.
   * e.g. "12.5¢/oz" when paired with originalPrice.
   */
  strikethroughCaption?: string;
  /** Per-unit price rendered below the main row, e.g. "12.5¢/oz"
   * @deprecated Use captionLabel
   */
  unitPrice?: string;
  /**
   * Generic caption label(s) rendered below the pricing block.
   * Pass a string for a single row or an array for multiple stacked rows.
   * Subtle color, caption/default weight.
   */
  captionLabel?: string | string[];
  /**
   * W+ subscribed price shown in the pricing zone via Attribute.
   * Renders as: [W+ icon] "$price.cents when subscribed"
   * Distinct from the Membership tag slot — this is an alternative price state.
   */
  subscribedPrice?: {
    price: string;
    cents: string;
    /** Attribute color token. Defaults to `"brand"` (W+ blue). */
    color?: AttributeColor;
    /** Override the visible label. Defaults to `"$price.cents when subscribed"`. */
    label?: string;
  };
  /**
   * When true, renders a standalone [W+ icon] "Early Access" Attribute row.
   * Independent of subscribedPrice.
   */
  earlyAccess?: boolean;
  /** Label for the Flag small positive pill ("Now" prefix only) */
  savingsLabel?: string;
  /** Optional trailing text after the savings pill */
  savingsAmount?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const PriceBlock: React.FunctionComponent<PriceBlockProps> = (props) => {
  const {
    price,
    cents,
    prefix,
    suffix,
    originalPrice,
    unitPrice,
    captionLabel,
    strikethroughCaption,
    subscribedPrice,
    earlyAccess,
    savingsLabel,
    savingsAmount,
    className,
    ...rest
  } = applyCommonProps(props);

  // Resolved per-render so the W+ mark tracks the active theme's media tenant.
  // Subscribed price and Early Access are W+ programs, so the Walmart family
  // ('wcp') resolves to the W+ mark rather than the plain Walmart spark.
  const mediaTenant = useThemeMediaTenant();
  const logoTenant = mediaTenant === 'wcp' ? 'walmart-plus' : mediaTenant;
  const wplusLogoSvg = getMedia(logoTenant, 'Logo')?.svg ?? '';

  const isSavings = prefix === 'Now';

  return (
    <div className={cx('ld-wcp-priceblock-root', className)} {...rest}>
      {/* Main price row — flat flex-wrap so all items, including wrapped ones, align to x=0 */}
      <div
        className={cx(
          'ld-wcp-priceblock-priceRow',
          isSavings && 'ld-wcp-priceblock-priceRowSavings'
        )}
      >
        <span className="ld-wcp-priceblock-primaryPrice">
          {prefix && <span className="ld-wcp-priceblock-prefix">{prefix}</span>}
          <span className="ld-wcp-priceblock-dollarSign" aria-hidden="true">$</span>
          <span className="ld-wcp-priceblock-price">{price}</span>
          <span className="ld-wcp-priceblock-cents">{cents}</span>
          {suffix && <span className="ld-wcp-priceblock-suffix">{suffix}</span>}
        </span>
        {originalPrice && (
          <span className="ld-wcp-priceblock-originalPrice">{originalPrice}</span>
        )}
        {strikethroughCaption && (
          <span className="ld-wcp-priceblock-strikethroughCaption">{strikethroughCaption}</span>
        )}
      </div>

      {/* Savings flag row — only shown when prefix === "Now" */}
      {savingsLabel && isSavings && (
        <div className="ld-wcp-priceblock-savingsRow">
          <Flag size="small" variant="positive" label={savingsLabel} />
          {savingsAmount && (
            <span className="ld-wcp-priceblock-savingsAmount">{savingsAmount}</span>
          )}
        </div>
      )}

      {/* Caption label(s) — sit below savings row; supports single string or array */}
      {(captionLabel ?? unitPrice) && (
        Array.isArray(captionLabel)
          ? captionLabel.map((line, i) => (
              <p key={i} className="ld-wcp-priceblock-captionLabel">{line}</p>
            ))
          : <p className="ld-wcp-priceblock-captionLabel">{captionLabel ?? unitPrice}</p>
      )}

      {/* W+ subscribed price — [icon] $X.XX when subscribed */}
      {subscribedPrice && (
        <div className="ld-wcp-priceblock-subscribed">
          <Attribute
            size="medium"
            color={subscribedPrice.color ?? 'brand'}
            variant="extended"
            leadingLogoSvg={wplusLogoSvg}
            iconLabel="Walmart Plus"
            label={subscribedPrice.label ?? `$${subscribedPrice.price}.${subscribedPrice.cents} when subscribed`}
            altLabel={subscribedPrice.label ?? `$${subscribedPrice.price}.${subscribedPrice.cents} when subscribed`}
            showLeadingLabel={false}
            showTrailingLabel={false}
          />
        </div>
      )}

      {/* Early Access — "with [W+ icon] Early Access" */}
      {earlyAccess && (
        <span className="ld-wcp-priceblock-earlyAccess">
          <VisuallyHidden>with Walmart Plus Early Access</VisuallyHidden>
          <span aria-hidden="true">with </span>
          {/* Logo from the media system so the W+ mark is theme-aware */}
          {wplusLogoSvg
            ? <span
                className="ld-wcp-priceblock-earlyAccessLogo"
                aria-hidden="true"
                dangerouslySetInnerHTML={{__html: wplusLogoSvg}}
              />
            : null}
          <span aria-hidden="true"> Early Access</span>
        </span>
      )}
    </div>
  );
};

PriceBlock.displayName = 'PriceBlock';
