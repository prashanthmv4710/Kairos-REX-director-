'use client';
// @refresh reset

/**
 * @module Form
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
 * For prop API + usage notes, read `Form.md` in this folder
 * or run `npm run ld-kit -- show Form`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {useStableId} from '../../common/helpers';
import {
  ExclamationCircleFillIcon,
} from '../Icons';
import {VisuallyHidden} from '../VisuallyHidden';
import {Caption} from '../Text';
import './Form.css';

// ---------------------------------------------------------------------------
// FormLabelMagicIcon
// ---------------------------------------------------------------------------

interface FormLabelMagicIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  disabled?: boolean;
}

const FormLabelMagicIcon: React.FC<FormLabelMagicIconProps> = ({disabled = false, ...rest}) => {
  const gradientId = useStableId();
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--ld-semantic-color-text-magic-start, #0053E2)" />
          <stop offset="50%" stopColor="var(--ld-semantic-color-text-magic-middle, #3D90EC)" />
          <stop offset="100%" stopColor="var(--ld-semantic-color-text-magic-stop, #79CDF6)" />
        </linearGradient>
      </defs>
      <path d="M6.98438 3.00049C7.17331 3.00054 7.36256 3.12552 7.45703 3.31396L7.70898 3.84814L7.80273 4.09912L7.83496 4.13135L9.09473 6.89502L11.8975 8.18311L12.1494 8.30908L12.6846 8.56006C12.8735 8.62289 13 8.81201 13 9.00049C12.9998 9.18881 12.8734 9.37703 12.6846 9.47119L12.1494 9.69092L11.8975 9.81689L9.09473 11.105L7.80273 13.8687V13.9009L7.67676 14.1519L7.45703 14.686C7.36256 14.8745 7.17331 15.0004 6.98438 15.0005C6.79542 15.0005 6.60598 14.8745 6.54297 14.686L6.29102 14.1519L6.16504 13.9009V13.8687L4.87402 11.105L2.10254 9.81689H2.07129L1.81934 9.69092L1.2832 9.47119C1.09453 9.377 1.00016 9.18874 1 9.00049C1 8.81208 1.09437 8.62309 1.2832 8.52881L1.81934 8.30908L2.07129 8.18311H2.10254L4.87402 6.89502L6.16504 4.09912L6.29102 3.84814L6.54297 3.31396C6.60598 3.12551 6.79542 3.00049 6.98438 3.00049ZM6.25977 7.52393C6.10228 7.83789 5.81871 8.11997 5.50391 8.24561L3.89746 9.00049L5.50391 9.75439C5.81871 9.88003 6.10228 10.1621 6.25977 10.4761L6.98438 12.0786L7.74023 10.4761C7.89773 10.1621 8.14999 9.88001 8.46484 9.75439L10.0713 9.00049L8.46484 8.24561C8.14999 8.11999 7.89773 7.83793 7.74023 7.52393L6.98438 5.92139L6.25977 7.52393ZM13 1.00049C13.0833 1.00049 13.1871 1.06247 13.208 1.1665L13.667 2.3335L14.833 2.7915C14.9372 2.81234 15 2.91716 15 3.00049C14.9998 3.10449 14.937 3.2082 14.833 3.229L13.667 3.6665L13.208 4.854C13.1872 4.93734 13.0833 5.00049 13 5.00049C12.8958 5.00049 12.7913 4.93734 12.7705 4.854L12.333 3.6665L11.1455 3.229C11.0625 3.208 11.0002 3.10435 11 3.00049C11 2.91724 11.0623 2.81249 11.1455 2.7915L12.333 2.3335L12.7705 1.1665C12.7914 1.06239 12.8959 1.00049 13 1.00049Z" fill={disabled ? 'currentColor' : `url(#${gradientId})`} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// FormLabel
// ---------------------------------------------------------------------------

export type FormLabelSize = 'large' | 'small';

export interface FormLabelProps extends React.ComponentPropsWithoutRef<'label'> {
  children: React.ReactNode;
  disabled?: boolean;
  isMagic?: boolean;
  size?: FormLabelSize;
}

export const FormLabel: React.FunctionComponent<FormLabelProps> = (props) => {

  const {children, className, disabled = false, isMagic = false, size = 'large', ...rest} = props;
  return (
    <label
      className={cx(
        'ld-form-formlabel-label',
        disabled && 'ld-form-formlabel-disabled',
        size === 'large' && 'ld-form-formlabel-large',
        size === 'small' && 'ld-form-formlabel-small',
        className,
      )}
      {...rest}
    >
      {isMagic && <FormLabelMagicIcon aria-hidden disabled={disabled} />}
      {children}
    </label>
  );
};

// ---------------------------------------------------------------------------
// FormHelperText
// ---------------------------------------------------------------------------

export interface FormHelperTextProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'color'> {
  children: React.ReactNode;
  disabled?: boolean;
  hasError?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const FormHelperText: React.FunctionComponent<FormHelperTextProps> = (props) => {

  const {children, className, disabled = false, hasError = false, ...rest} = props;
  return (
    <Caption
      UNSAFE_className={cx(
        'ld-form-formhelpertext-helperText',
        disabled && 'ld-form-formhelpertext-disabled',
        hasError && 'ld-form-formhelpertext-hasError',
        className,
      )}
      {...rest}
    >
      {hasError && (
        <>
          <VisuallyHidden>Error: </VisuallyHidden>
          <ExclamationCircleFillIcon className={'ld-form-formhelpertext-icon'} size="small" />
        </>
      )}
      {children}
    </Caption>
  );
};
