# SignatureCapture

**Import:** `import { SignatureCapture } from "./components/SignatureCapture"`
**Category:** components
**Intent:** E-signature agreement block (trigger/terms/base/reauth variants). Embed via SignatureCaptureBottomSheet or SignatureCapturePanel

## Props

- `variant`: "trigger" | "terms" | "base" | "reauth" (required)
- `userName`: string
- `signatureState`: "unsigned" | "signed" | "signed-as"
- `signedName`: string
- `onAgreeAndSign`: () => void
- `onChangeSignature`: () => void
- `onRefreshPage`: () => void
- `onConfirm`: () => void
- `subText`: string
- `title`: string
- `showPreviewWarning`: boolean
- `showTechError`: boolean
- `showPetNameWarning`: boolean
- `showSignBeforeSubmitError`: boolean
- `showPreviewBeforeSignError`: boolean
- `showCheckboxError`: boolean
- `fullName`: string
- `onFullNameChange`: (name: string) => void
- `onPreviewSignature`: () => void
- `isSignChecked`: boolean
- `onSignCheckedChange`: (checked: boolean) => void
- `reauthSubVariant`: "agree-sign" | "signed" | "signed-as"
- `showReauthError`: boolean

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
