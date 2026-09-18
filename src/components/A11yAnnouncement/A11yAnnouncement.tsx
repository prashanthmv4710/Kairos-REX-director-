// @refresh reset

/**
 * @module A11yAnnouncement
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
 * For prop API + usage notes, read `A11yAnnouncement.md` in this folder
 * or run `npm run ld-kit -- show A11yAnnouncement`.
 */

import * as React from 'react';
import {VisuallyHidden} from '../VisuallyHidden';

type A11yAnnouncementValue = Readonly<{
  announceAssertive: (announcement: string) => void;
  announcePolite: (announcement: string) => void;
}>;

export const A11yAnnouncementContext = React.createContext<A11yAnnouncementValue>({
  announceAssertive: () => undefined,
  announcePolite: () => undefined,
});

export interface A11yAnnouncementProviderProps {
  /**
   * The content for the a11y announcement.
   */
  children: React.ReactNode;
}

/**
 * Five unique zero-width character combinations used to prefix each announcement.
 * aria-live regions suppress duplicate messages — cycling through these prefixes
 * ensures the string content changes on every call so repeat announcements are
 * always re-read by screen readers. The prefixes are invisible to sighted users
 * because zero-width characters render nothing visually.
 */
const A11Y_PREFIXES = [
  '',           // no prefix (first announcement)
  '\u200B',     // zero-width space
  '\u200C',     // zero-width non-joiner
  '\u200B\u200B',
  '\u200B\u200C',
];

/**
 * @private
 */
export const A11yAnnouncementProvider: React.FunctionComponent<
  A11yAnnouncementProviderProps
> = (props) => {
  const {children} = props;

  const [assertive, setAssertive] = React.useState<string>();
  const [polite, setPolite] = React.useState<string>();

  const assertiveIndexRef = React.useRef(0);
  const politeIndexRef = React.useRef(0);

  const contextValue = React.useRef({
    announceAssertive: (message: string) => {
      const prefix = A11Y_PREFIXES[assertiveIndexRef.current % A11Y_PREFIXES.length];
      assertiveIndexRef.current += 1;
      setAssertive(prefix + message);
    },
    announcePolite: (message: string) => {
      const prefix = A11Y_PREFIXES[politeIndexRef.current % A11Y_PREFIXES.length];
      politeIndexRef.current += 1;
      setPolite(prefix + message);
    },
  });

  return (
    <A11yAnnouncementContext.Provider value={contextValue.current}>
      {children}

      <VisuallyHidden aria-live="assertive" data-live-announcer="true">
        {assertive}
      </VisuallyHidden>
      <VisuallyHidden aria-live="polite" data-live-announcer="true">
        {polite}
      </VisuallyHidden>
    </A11yAnnouncementContext.Provider>
  );
};

A11yAnnouncementProvider.displayName = 'A11yAnnouncementProvider';

export const useA11yAnnouncement = () => React.useContext(A11yAnnouncementContext);

/**
 * Friendlier alias for `useA11yAnnouncement` with a shorter API shape.
 *
 * Returns `{polite, assertive}` methods that push content into the global
 * live regions mounted by `A11yAnnouncementProvider`. Use `polite` for
 * non-urgent updates (search result counts, filter applied). Use
 * `assertive` ONLY for urgent announcements (session about to expire).
 *
 * @example
 * const announce = useAnnounce();
 * useEffect(() => {
 *   announce.polite(`${results.length} results for "${query}"`);
 * }, [results, query]);
 */
export function useAnnounce(): {
  polite: (message: string) => void;
  assertive: (message: string) => void;
} {
  const {announcePolite, announceAssertive} = React.useContext(A11yAnnouncementContext);
  return React.useMemo(
    () => ({polite: announcePolite, assertive: announceAssertive}),
    [announcePolite, announceAssertive],
  );
}
