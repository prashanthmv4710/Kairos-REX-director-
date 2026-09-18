// @refresh reset

/**
 * @module QueueLanding
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
 * For prop API + usage notes, read `QueueLanding.md` in this folder
 * or run `npm run ld-kit -- show QueueLanding`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {TimerView, TimerViewVariant} from '../../components/TimerView';
import {Button} from '../../components/Button';
import './QueueLanding.css';

export type QueueLandingVariant = 'authenticated' | 'unauthenticated';

export interface QueueLandingProduct {
  image?: string;
  description: string;
  price: string;
  originalPrice?: string;
}

export interface QueueLandingProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  variant?: QueueLandingVariant;
  product: QueueLandingProduct;
  timeDisplay?: string;
  endTime?: Date | number | string;
  timerVariant?: TimerViewVariant;
  onSignIn?: () => void;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

// Inline hourglass illustration SVG
const HourglassIllustration = () => (
  <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="75" height="75" rx="37.5" fill="#ACC8FB"/>
    <path d="M23.625 11.906C23.625 11.13 24.254 10.5 25.031 10.5H49.969C50.746 10.5 51.375 11.13 51.375 11.906V14.855H23.625V11.906Z" fill="#0E002E"/>
    <path d="M51.375 63.094C51.375 63.871 50.746 64.5 49.969 64.5H25.031C24.254 64.5 23.625 63.871 23.625 63.094V60.145H51.375V63.094Z" fill="#0E002E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M26.227 14.855H48.773V21.678C48.773 25.396 47.301 28.963 44.677 31.598L38.801 37.5H36.199L30.323 31.598C27.699 28.963 26.227 25.396 26.227 21.678V14.855Z" fill="#E3E4E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M27.094 23.565H47.906C47.34 26.125 46.057 28.47 44.207 30.328L38.994 35.564C38.17 36.392 36.83 36.392 36.006 35.564L30.793 30.328C28.943 28.47 27.66 26.125 27.094 23.565Z" fill="#FFC220"/>
    <path opacity="0.6" d="M33.164 14.855H26.227V23.887C26.227 26.191 27.139 28.4 28.764 30.033L36.199 37.5H37.5L34.161 29.452C33.503 27.865 33.164 26.164 33.164 24.446V14.855Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M48.773 60.145H26.227V53.322C26.227 49.604 27.699 46.037 30.323 43.402L36.199 37.5H38.801L44.677 43.402C47.301 46.037 48.773 49.604 48.773 53.322V60.145Z" fill="#E3E4E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M47.906 60.145H27.094L36.188 52.915C36.956 52.304 38.044 52.304 38.813 52.915L47.906 60.145Z" fill="#FFC220"/>
    <path opacity="0.6" d="M33.164 60.145H26.227V51.113C26.227 48.809 27.139 46.6 28.764 44.967L36.199 37.5H37.5L34.161 45.548C33.503 47.135 33.164 48.836 33.164 50.554V60.145Z" fill="white"/>
  </svg>
);

const ProductInfo = ({product}: {product: QueueLandingProduct}) => (
  <div className="ld-wcp-queuelanding-productRow">
    {product.image ? (
      <img src={product.image} alt={product.description} className="ld-wcp-queuelanding-productImage" />
    ) : (
      <div className="ld-wcp-queuelanding-productPlaceholder" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )}
    <div className="ld-wcp-queuelanding-productDetails">
      <span className="ld-wcp-queuelanding-productDescription">{product.description}</span>
      <div className="ld-wcp-queuelanding-productPricing">
        <span className="ld-wcp-queuelanding-productPrice">{product.price}</span>
        {product.originalPrice && <span className="ld-wcp-queuelanding-productOriginal">{product.originalPrice}</span>}
      </div>
    </div>
  </div>
);

export const QueueLanding: React.FunctionComponent<QueueLandingProps> = (props) => {
  const {variant = 'authenticated', product, timeDisplay = '59mins', endTime, timerVariant = 'waiting', onSignIn, className, ...rest} = applyCommonProps(props);

  if (variant === 'unauthenticated') {
    return (
      <div className={cx('ld-wcp-queuelanding-landing', className)} {...rest}>
        <div className="ld-wcp-queuelanding-unauthHero">
          <span className="ld-wcp-queuelanding-unauthTitle">Sign in to join the line</span>
          <span className="ld-wcp-queuelanding-heroSubtext">Sign in with your Walmart account to get in line for this item.</span>
          <Button variant="primary" size="medium" onClick={onSignIn}>Sign in</Button>
        </div>
        <div className="ld-wcp-queuelanding-card">
          <div className="ld-wcp-queuelanding-cardContent">
            <ProductInfo product={product} />
          </div>
        </div>
        <div className="ld-wcp-queuelanding-accountLink">
          <span className="ld-wcp-queuelanding-accountText">Don&apos;t have an account?</span>
          <button type="button" className="ld-wcp-queuelanding-createLink">Create account</button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('ld-wcp-queuelanding-landing', className)} {...rest}>
      <div className="ld-wcp-queuelanding-heroSection">
        <div className="ld-wcp-queuelanding-illustrationWrap">
          <HourglassIllustration />
        </div>
        <div className="ld-wcp-queuelanding-titleBlock">
          <span className="ld-wcp-queuelanding-heroTitle">You&apos;re in line</span>
          <span className="ld-wcp-queuelanding-heroSubtext">We&apos;ll hold this item for you while you wait.</span>
        </div>
      </div>
      <div className="ld-wcp-queuelanding-card">
        <div className="ld-wcp-queuelanding-cardContent">
          <div className="ld-wcp-queuelanding-waitSection">
            <div className="ld-wcp-queuelanding-waitGroup">
              <span className="ld-wcp-queuelanding-waitLabel">Estimated wait</span>
              <TimerView timeDisplay={timeDisplay} endTime={endTime} variant={timerVariant} size="medium" />
            </div>
            <span className="ld-wcp-queuelanding-disclaimer">*Time is subject to change</span>
          </div>
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
};
QueueLanding.displayName = 'QueueLanding';
