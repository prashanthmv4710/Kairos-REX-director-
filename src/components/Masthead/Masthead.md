# Masthead

**Import:** `import { Masthead } from "./components/Masthead"`
**Category:** components
**Intent:** PX top-of-app header bar (logo/name, left/center/right slots, opt-in Bell/Help/Account). For the retail site header, use Header

## Props

- `a11yLabel`: string — Accessible name for the `<header>` landmark. Pages can have multiple
- `appName`: string — App name shown beside the logo. Ignored if `appLogo` is supplied.
- `appLogo`: string | ReactNode — Either an image URL (rendered as `<img>`) or a custom node for the logo slot.
- `appLogoAlt`: string — Alt text used when `appLogo` is a string image URL. Falls back to
- `leftSlot`: ReactNode — Content rendered at the start of the left group, before the app name/logo. Use this for an app-switcher or hamburger.
- `centerSlot`: ReactNode — Content rendered between the left and right groups (e.g. a workspace switcher).
- `rightSlot`: ReactNode — Content rendered at the start of the right group, before the built-in actions (e.g. LanguageSelector, custom buttons).
- `onNotificationClick`: (event: MouseEvent<HTMLButtonElement>) => void — Fires the notification button. If omitted, the Bell button is not rendered.
- `notificationDot`: boolean — Show the small red dot on the notification button.
- `notificationLabel`: string — Accessible name for the notification button.
- `notificationUnreadLabel`: string — Visually-hidden text appended to the notification button when
- `onHelpClick`: (event: MouseEvent<HTMLButtonElement>) => void — Fires the help button. If omitted, the Help button is not rendered.
- `helpLabel`: string — Accessible name for the help button.
- `onAccountClick`: (event: MouseEvent<HTMLButtonElement>) => void — Fires the account button. If omitted, the Account button is not rendered.
- `accountLabel`: string — Accessible name for the account button.