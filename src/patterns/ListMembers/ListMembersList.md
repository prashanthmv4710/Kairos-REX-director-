# ListMembersList

**Import:** `import { ListMembersList } from "./patterns/ListMembers"`
**Category:** patterns
**Intent:** List pattern for team-member/scheduling lists with monitoring section and shift tags. Use ListMembersList + ListMembersItem

## Composition

`ListMembersList` is part of a compound component. Use together with: `ListMembers`, `ListMembersItem`.

All pieces import from the same path (`./patterns/ListMembers`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)