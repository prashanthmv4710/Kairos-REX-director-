/* Auto-generated from Airtable "All Media" view — do not edit by hand */

// SVG loaders ONLY — deliberately in their own module. See writeMediaLoaders
// in airtable-sync/lib/media-pipeline.mjs: co-locating the PNG loaders here
// pulled every brand PNG into any bundle containing <Logo>, because a dynamic
// import still puts its target in the module graph and assets emit from the
// graph, not from the surviving chunks.

/** Media theme key → async loader for that tenant's inline SVG map. Use in
 *  components so only the active theme's media is bundled/fetched (code-split
 *  per tenant) instead of the whole MEDIA_SVGS aggregate.
 *
 *  Targets `./<key>.svgs`, NOT `./<key>`: the latter also carries the tenant's
 *  PNG imports. */
export const MEDIA_SVG_LOADERS: Record<string, () => Promise<Record<string, string>>> = {
  'customer': () => import('./customer.svgs').then((m) => m.AGENT_CUSTOMER_MEDIA_SVGS),
  'partner': () => import('./partner.svgs').then((m) => m.AGENT_PARTNER_MEDIA_SVGS),
  'associate': () => import('./associate.svgs').then((m) => m.AGENT_ASSOCIATE_MEDIA_SVGS),
  'developer': () => import('./developer.svgs').then((m) => m.AGENT_DEVELOPER_MEDIA_SVGS),
  'wibey': () => import('./wibey.svgs').then((m) => m.AGENT_WIBEY_MEDIA_SVGS),
  'wibey-light': () => import('./wibey-light.svgs').then((m) => m.AGENT_WIBEY_LIGHT_MEDIA_SVGS),
  'my-walmart': () => import('./my-walmart.svgs').then((m) => m.AGENT_MY_WALMART_MEDIA_SVGS),
  'me-campus': () => import('./me-campus.svgs').then((m) => m.AGENT_ME_CAMPUS_MEDIA_SVGS),
  'wally': () => import('./wally.svgs').then((m) => m.AGENT_WALLY_MEDIA_SVGS),
  'wcp': () => import('./wcp.svgs').then((m) => m.WCP_MEDIA_SVGS),
  'walmart-business': () => import('./walmart-business.svgs').then((m) => m.WALMART_BUSINESS_MEDIA_SVGS),
  'walmart-mx': () => import('./walmart-mx.svgs').then((m) => m.WALMART_MX_MEDIA_SVGS),
  'walmart-ca': () => import('./walmart-ca.svgs').then((m) => m.WALMART_CA_MEDIA_SVGS),
  'walmart-plus': () => import('./walmart-plus.svgs').then((m) => m.WALMART_PLUS_MEDIA_SVGS),
  'sams-club': () => import('./sams-club.svgs').then((m) => m.SAMS_CLUB_MEDIA_SVGS),
  'sams-club-maverick': () => import('./sams-club-maverick.svgs').then((m) => m.SAMS_CLUB_MAVERICK_MEDIA_SVGS),
  'members-mark': () => import('./members-mark.svgs').then((m) => m.MEMBERS_MARK_MEDIA_SVGS),
  'bodega': () => import('./bodega.svgs').then((m) => m.BODEGA_MEDIA_SVGS),
  'walmart-legacy': () => import('./walmart-legacy.svgs').then((m) => m.WALMART_LEGACY_MEDIA_SVGS),
};
