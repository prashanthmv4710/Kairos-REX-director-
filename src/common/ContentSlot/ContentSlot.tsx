import * as React from 'react';
import './ContentSlot.css';

/**
 * ContentSlot — design-utility placeholder that marks where a custom content
 * component should be inserted. Renders a pink dashed-border box with a
 * centred reminder label. Not intended for production use.
 */
export function ContentSlot({className, style}: {className?: string; style?: React.CSSProperties}) {
  return (
    <div className={`ld-content-slot${className ? ` ${className}` : ''}`} style={style}>
      <p className="ld-content-slot__label">Replace with your content component.</p>
    </div>
  );
}

ContentSlot.displayName = 'ContentSlot';
