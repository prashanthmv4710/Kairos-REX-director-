import * as React from 'react';
import { Icon } from '../Icons';

/**
 * Bridges the font-based `Icon` component to the `ComponentType<SVGProps<SVGSVGElement>>`
 * shape that `SidebarShellMenuItem.Icon` expects. `SidebarShell` renders this with
 * `className` (for active/inactive styling) and numeric `width`/`height` (ignored —
 * the font icon is rendered at a fixed small size instead).
 */
export function createNavIcon(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  const NavIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className }) => (
    <Icon name={name} size="small" decorative className={className} />
  );
  NavIcon.displayName = `NavIcon(${name})`;
  return NavIcon;
}
