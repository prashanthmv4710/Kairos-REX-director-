/* Auto-generated from Airtable "All Media" view — do not edit by hand */

// PNG loaders ONLY — kept apart from ./svg-loaders so that importing the SVG
// loaders cannot pull the tenant modules that carry PNG asset imports.

/** Media theme key → async loader for that tenant's PNG asset-URL map. */
export const MEDIA_IMAGE_LOADERS: Record<string, () => Promise<Record<string, string>>> = {
  'customer': () => import('./customer').then((m) => m.AGENT_CUSTOMER_MEDIA_IMAGES),
  'partner': () => import('./partner').then((m) => m.AGENT_PARTNER_MEDIA_IMAGES),
  'associate': () => import('./associate').then((m) => m.AGENT_ASSOCIATE_MEDIA_IMAGES),
  'developer': () => import('./developer').then((m) => m.AGENT_DEVELOPER_MEDIA_IMAGES),
  'wibey': () => import('./wibey').then((m) => m.AGENT_WIBEY_MEDIA_IMAGES),
  'wibey-light': () => import('./wibey-light').then((m) => m.AGENT_WIBEY_LIGHT_MEDIA_IMAGES),
  'my-walmart': () => import('./my-walmart').then((m) => m.AGENT_MY_WALMART_MEDIA_IMAGES),
  'me-campus': () => import('./me-campus').then((m) => m.AGENT_ME_CAMPUS_MEDIA_IMAGES),
  'wally': () => import('./wally').then((m) => m.AGENT_WALLY_MEDIA_IMAGES),
  'wcp': () => import('./wcp').then((m) => m.WCP_MEDIA_IMAGES),
  'walmart-business': () => import('./walmart-business').then((m) => m.WALMART_BUSINESS_MEDIA_IMAGES),
  'walmart-mx': () => import('./walmart-mx').then((m) => m.WALMART_MX_MEDIA_IMAGES),
  'walmart-ca': () => import('./walmart-ca').then((m) => m.WALMART_CA_MEDIA_IMAGES),
  'walmart-plus': () => import('./walmart-plus').then((m) => m.WALMART_PLUS_MEDIA_IMAGES),
  'sams-club': () => import('./sams-club').then((m) => m.SAMS_CLUB_MEDIA_IMAGES),
  'sams-club-maverick': () => import('./sams-club-maverick').then((m) => m.SAMS_CLUB_MAVERICK_MEDIA_IMAGES),
  'members-mark': () => import('./members-mark').then((m) => m.MEMBERS_MARK_MEDIA_IMAGES),
  'bodega': () => import('./bodega').then((m) => m.BODEGA_MEDIA_IMAGES),
  'walmart-legacy': () => import('./walmart-legacy').then((m) => m.WALMART_LEGACY_MEDIA_IMAGES),
};
