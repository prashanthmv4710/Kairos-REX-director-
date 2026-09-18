// ---------------------------------------------------------------------------
// Human-readable labels derived from a rule id + CSS selector.
// ---------------------------------------------------------------------------

const ELEMENT_TYPE_MAP: Record<string, string> = {
  button: 'Button',
  input: 'Input',
  select: 'Select',
  textarea: 'Textarea',
  a: 'Link',
  img: 'Image',
  h1: 'Heading',
  h2: 'Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  h6: 'Heading',
  label: 'Label',
  form: 'Form',
  nav: 'Navigation',
  table: 'Table',
  ul: 'List',
  ol: 'List',
  li: 'List Item',
  div: 'Container',
  span: 'Span',
  section: 'Section',
  article: 'Article',
  header: 'Header',
  footer: 'Footer',
  main: 'Main',
  aside: 'Aside',
  dialog: 'Dialog',
  video: 'Video',
  audio: 'Audio',
  iframe: 'Frame',
  svg: 'SVG',
  fieldset: 'Fieldset',
  legend: 'Legend',
  details: 'Details',
  summary: 'Summary',
  p: 'Paragraph',
};

export function extractElementType(selector: string): string {
  // Extract the tag name from selectors like "button.icon-only", "input#email", "h4.title", "div > button"
  const lastPart = selector.split(/[\s>+~]/).pop() || selector;
  const tag = lastPart.replace(/[.#\[:].*/g, '').toLowerCase();
  return ELEMENT_TYPE_MAP[tag] || tag.charAt(0).toUpperCase() + tag.slice(1) || 'Element';
}

const ISSUE_TITLE_MAP: Record<string, (selector: string) => string> = {
  'missing-h1': () => 'Page missing heading',
  'multiple-h1': () => 'Multiple h1 headings',
  'missing-main': () => 'Page missing main landmark',
  'multiple-main': () => 'Multiple main landmarks',
  'heading-order': () => `Heading level skipped`,
  'img-missing-alt': () => 'Image missing alt text',
  'img-whitespace-alt': () => 'Image has blank alt',
  'missing-accessible-name': (s) => `${extractElementType(s)} has no label`,
  'nested-interactive': () => 'Nested interactive elements',
  'role-button-no-keyboard': () => 'Button not keyboard accessible',
  'duplicate-id': (s) => {
    const match = s.match(/id="([^"]+)"/);
    return match ? `Duplicate id "${match[1]}"` : 'Duplicate id';
  },
  'form-control-no-label': (s) => `${extractElementType(s)} has no label`,
  'single-select-group': () => 'Group missing keyboard nav',
  'roving-tabindex': () => 'Group missing roving tabindex',
};

export function issueTitle(rule: string, selector: string): string {
  const fn = ISSUE_TITLE_MAP[rule];
  return fn ? fn(selector) : 'Accessibility issue';
}

/** Extract the explanatory tail after "—", stripping the part that repeats the title. */
export function issueSubtext(simplified: string): string {
  let text: string;
  const dashIdx = simplified.indexOf(' — ');
  if (dashIdx !== -1) text = simplified.slice(dashIdx + 3);
  else {
    const dotIdx = simplified.indexOf('. ');
    text = dotIdx !== -1 ? simplified.slice(dotIdx + 2) : simplified;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}
