# Header

**Import:** `import { Header } from "./patterns/Header"`
**Category:** patterns
**Intent:** Full responsive site header (search / cart / account)

## Props

- `cartCount`: number
- `cartPrice`: string
- `mobileVariant`: "classic" | "topnav-blue" | "topnav-white" | "native-android" | "native-ios"
- `showDesktopSubNav`: boolean — The category/department nav strip under the desktop top bar. On by default.
- `showMobileSubNav`: boolean
- `showMobileDeliveryBanner`: boolean — The GIC (pickup/delivery + location) banner on the topnav mobile web
- `a11yNavLabel`: string — Override the desktop nav landmark label ("Account and Cart").
- `a11yMobileSearchLabel`: string — Override the mobile search form landmark label.
- `a11yCategoryNavLabel`: string — Override the category nav landmark label.