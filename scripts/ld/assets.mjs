/**
 * cli/engine/assets.mjs — icon, illustration, media, and product asset lookup.
 *
 * The frontend runtime utilities already do exactly this at render time:
 * `iconManager.searchIcons(font, query)`, `illustrationManager.searchIllustrations(type, query)`,
 * `mediaManager.searchMedia(tenant, query)`, `ProductService.searchProducts(query)`.
 * Before this module, the CLI could tell you those functions EXIST
 * (`show iconManager`) but not RUN their equivalent — an agent still had to
 * open the raw manifest JSON by hand. This reads the same shipped manifests
 * and answers the same questions.
 *
 * Icons/illustrations/media share one on-disk shape:
 * `{[bucket]: {label, count, <items>}}`, `<items>` being a list of names
 * (icons) or objects with `.name` (illustrations, media). Products are backed
 * by `productCatalog.json` instead, which nests by category/subcategory;
 * `toProductManifest` reshapes it to the same `{[bucket]: {label, count,
 * products}}` shape so it can share `bucketsOf`/`itemsOf`/`searchAll` below.
 * Substring matching throughout — these are identifiers, so "cart" reaching
 * "ShoppingCart" is exactly what you want.
 *
 * Pure: no I/O. Manifests are read by corpus.mjs and passed in. Ships
 * verbatim into generated projects as scripts/ld/assets.mjs.
 */

function bucketsOf(manifest, itemsKey, nameOf) {
  return Object.entries(manifest ?? {}).map(([key, b]) => ({
    key,
    label: b.label ?? key,
    count: b.count ?? (b[itemsKey] ?? []).length,
  }));
}

function itemsOf(manifest, bucket, itemsKey) {
  return manifest?.[bucket]?.[itemsKey] ?? [];
}

function searchAll(manifest, itemsKey, nameOf, query, tagKey) {
  const q = query.toLowerCase();
  const hits = [];
  for (const [bucket, b] of Object.entries(manifest ?? {})) {
    for (const item of b[itemsKey] ?? []) {
      if (nameOf(item).toLowerCase().includes(q)) {
        hits.push(typeof item === 'string' ? {[tagKey]: bucket, name: item} : {[tagKey]: bucket, ...item});
      }
    }
  }
  return hits;
}

// ── icons: {[font]: {label, fontFamily, cssClass, count, icons: string[]}} ──

export function listIconFonts(manifest) {
  return bucketsOf(manifest, 'icons');
}
export function listIcons(manifest, font) {
  return itemsOf(manifest, font, 'icons');
}
export function searchIcons(manifest, font, query) {
  const q = query.toLowerCase();
  return listIcons(manifest, font).filter((n) => n.toLowerCase().includes(q));
}
export function searchIconsAllFonts(manifest, query) {
  return searchAll(manifest, 'icons', (n) => n, query, 'font');
}
/** theme-icon-map.json's `themes` object: theme name -> primary font key. */
export function resolveIconFontForTheme(themeMap, theme) {
  return themeMap?.themes?.[theme] ?? null;
}

// ── illustrations: {[type]: {label, count, items: [{name,width,height}]}} ──

export function listIllustrationTypes(manifest) {
  return bucketsOf(manifest, 'items');
}
export function listIllustrations(manifest, type) {
  return itemsOf(manifest, type, 'items').map((i) => i.name);
}
export function searchIllustrations(manifest, type, query) {
  const q = query.toLowerCase();
  return itemsOf(manifest, type, 'items').filter((i) => i.name.toLowerCase().includes(q));
}
export function searchIllustrationsAllTypes(manifest, query) {
  return searchAll(manifest, 'items', (i) => i.name, query, 'type');
}

// ── media: {[tenant]: {label, count, assets: [{name,token,kind,width,height}]}} ──

export function listMediaTenants(manifest) {
  return bucketsOf(manifest, 'assets');
}
export function listMedia(manifest, tenant) {
  return itemsOf(manifest, tenant, 'assets');
}
export function searchMedia(manifest, tenant, query) {
  const q = query.toLowerCase();
  return itemsOf(manifest, tenant, 'assets').filter((a) => a.name.toLowerCase().includes(q));
}
export function searchMediaAllTenants(manifest, query) {
  return searchAll(manifest, 'assets', (a) => a.name, query, 'tenant');
}

// ── products: raw productCatalog.json is {categories: [{id, name,
// subcategories: [{id, name, items: [...]}]}], heroBanners, marketingTiles}.
// Reshaped to {[categoryId]: {label, count, products: [{sku, name, price,
// cents, priceCents, categoryId, categoryName, subcategoryId,
// subcategoryName}]}} so it fits bucketsOf/itemsOf/searchAll like the others.

export function toProductManifest(catalog) {
  const manifest = {};
  for (const cat of catalog?.categories ?? []) {
    const products = [];
    for (const sub of cat.subcategories ?? []) {
      for (const item of sub.items ?? []) {
        products.push({
          sku: item.sku,
          name: item.name,
          price: item.price,
          cents: item.cents,
          priceCents: item.priceCents,
          categoryId: cat.id,
          categoryName: cat.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
        });
      }
    }
    manifest[cat.id] = {label: cat.name, count: products.length, products};
  }
  return manifest;
}

export function listProductCategories(manifest) {
  return bucketsOf(manifest, 'products');
}
export function listProducts(manifest, categoryId) {
  return itemsOf(manifest, categoryId, 'products');
}
export function searchProducts(manifest, categoryId, query) {
  const q = query.toLowerCase();
  return itemsOf(manifest, categoryId, 'products').filter(
    (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
  );
}
export function searchProductsAllCategories(manifest, query) {
  return searchAll(manifest, 'products', (p) => `${p.name} ${p.sku}`, query, 'category');
}
