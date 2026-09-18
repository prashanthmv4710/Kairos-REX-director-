import type React from 'react';

export type PolymorphicElementWithoutRef<E extends React.ElementType, P> =
  P & Omit<React.ComponentPropsWithoutRef<E>, keyof P> & { as?: E };

export type WithIconProps = React.SVGProps<SVGSVGElement> & {
  a11yLabel?: string;
  size?: 'small' | 'medium' | 'large';
};
