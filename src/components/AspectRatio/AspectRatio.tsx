// @refresh reset

/**
 * @module AspectRatio
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
 * For prop API + usage notes, read `AspectRatio.md` in this folder
 * or run `npm run ld-kit -- show AspectRatio`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/AspectRatio.tsx
 *
 * Pure layout primitive: maintains a fixed width / height ratio for any
 * children. No external deps; replaces the kit's Radix-based AspectRatio.
 *
 * ---
 * ## Accessibility guidelines
 *
 * `AspectRatio` is a layout utility — it has no intrinsic accessibility
 * behaviour. Responsibility lies with the consumer based on content type:
 *
 * ### Visible media (`<img>`, `<video>`, `<iframe>`)
 * - `<img>` — always provide an `alt` attribute.
 *   - Meaningful image: `alt="descriptive text"`
 *   - Purely decorative: `alt=""` (empty string, not omitted)
 * - `<video>` — provide captions and/or a transcript.
 * - `<iframe>` — provide a descriptive `title` attribute.
 *
 * ### CSS background images
 * - **Meaningful** (conveys information a sighted user would read): add a
 *   visually hidden text node inside the container so screen readers
 *   announce it:
 *   ```tsx
 *   <AspectRatio ratio={16 / 9} style={{backgroundImage: 'url(...)'}}>
 *     <span className="sr-only">Descriptive text here</span>
 *   </AspectRatio>
 *   ```
 * - **Purely decorative** (design flourish, texture, etc.): no additional
 *   markup needed — adding empty or redundant text would create noise for
 *   screen reader users.
 */
import * as React from 'react';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** width / height. e.g. `16 / 9` for video, `1` for square. @default 1 */
  ratio?: number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio({ratio = 1, style, children, ...props}, ref) {
    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: `${100 / ratio}%`,
          ...style,
        }}
        {...props}
      >
        <div style={{position: 'absolute', inset: 0}}>{children}</div>
      </div>
    );
  },
);

AspectRatio.displayName = 'AspectRatio';
