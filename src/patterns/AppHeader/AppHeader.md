# AppHeader

**Import:** `import { AppHeader } from "./patterns/AppHeader"`
**Category:** patterns
**Intent:** Mobile associate-app top bar with status bar, title, search, actions, and account menu (variant + platform)

## Props

- `variant`: "blue" | "white"
- `platform`: "ios" | "android"
- `isTablet`: boolean
- `title`: string
- `subtitle`: string
- `showSubtitle`: boolean
- `showSearch`: boolean
- `showAvatar`: boolean
- `showAction1`: boolean
- `showAction2`: boolean
- `showAction3`: boolean
- `showAction4`: boolean
- `menuIconName`: string
- `action1IconName`: string
- `action2IconName`: string
- `action3IconName`: string
- `action4IconName`: string
- `avatarInitials`: string
- `onMenuClick`: () => void
- `onAvatarClick`: () => void
- `onActionClick`: (actionIndex: 1 | 2 | 3 | 4) => void