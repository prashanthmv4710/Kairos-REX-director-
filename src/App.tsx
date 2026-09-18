import * as React from 'react';
import { useInitializeTheming } from "./utils/Theming";
import { useInitializeStore } from "./utils/store";
import { A11yAnnouncementProvider } from "./components/A11yAnnouncement";
import { A11yDevAssertions } from "./components/A11yDevAssertions";
import { SnackbarProvider } from "./components/Snackbar";
import { AppShell } from "./components/custom/AppShell";
import { InboxPage } from "./pages/InboxPage";

// This app has exactly one screen (InboxPage), so it doesn't use a router.
// Standalone single-file HTML builds (`npm run build:html`) run inside a
// sandboxed `srcdoc` iframe when hosted (e.g. puppy.walmart.com/sharing),
// which has an opaque `about:srcdoc` origin. react-router's history
// internals try to construct a `URL` from that origin and throw
// `Failed to construct 'URL': Invalid URL`, crashing the app before mount.
// Since there's nowhere to route to, we just render the one page directly.
export default function App() {
  useInitializeTheming('Walmart', ['Walmart'] as const);
  useInitializeStore();

  return (
    <A11yAnnouncementProvider>
      <A11yDevAssertions />
      <SnackbarProvider>
        <AppShell>
          <InboxPage />
        </AppShell>
      </SnackbarProvider>
    </A11yAnnouncementProvider>
  );
}
