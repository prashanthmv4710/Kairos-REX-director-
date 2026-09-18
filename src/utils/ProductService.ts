import catalogData from '../data/productCatalog.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProductBadge = {label: string; type: string} | null;

export interface Product {
  sku: string;
  name: string;
  price: string;
  cents: string;
  priceCents: number;
  originalPrice: string | null;
  rating: number;
  ratingCount: string;
  /** Resolved CDN image URL */
  imageUrl: string;
  badge: ProductBadge;
  pickup: string;
  ebt: boolean;
  flag: string | null;
  /** Parent category id */
  categoryId: string;
  /** Parent category display name */
  categoryName: string;
  /** Parent subcategory id */
  subcategoryId: string;
  /** Parent subcategory display name */
  subcategoryName: string;
}

export interface Subcategory {
  id: string;
  name: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  /** Flat list of every product in all subcategories */
  allProducts: Product[];
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
}

export interface MarketingTile {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Build the catalog once at import time
// ---------------------------------------------------------------------------

function buildCategories(): Category[] {
  return catalogData.categories.map((cat) => {
    const subcategories: Subcategory[] = cat.subcategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      products: sub.items.map((product) => ({
        ...product,
        imageUrl: product.imageUrl,
        categoryId: cat.id,
        categoryName: cat.name,
        subcategoryId: sub.id,
        subcategoryName: sub.name,
      })),
    }));

    return {
      id: cat.id,
      name: cat.name,
      subcategories,
      allProducts: subcategories.flatMap((s) => s.products),
    };
  });
}

const categories: Category[] = buildCategories();
const allProducts: Product[] = categories.flatMap((c) => c.allProducts);
const heroBanners: HeroBanner[] = catalogData.heroBanners;
const marketingTiles: MarketingTile[] = catalogData.marketingTiles;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** All top-level categories with nested subcategories and products. */
export function getCategories(): Category[] {
  return categories;
}

/** Flat list of every product across all categories. */
export function getAllProducts(): Product[] {
  return allProducts;
}

/** Products belonging to a single category. */
export function getProductsByCategory(categoryId: string): Product[] {
  return categories.find((c) => c.id === categoryId)?.allProducts ?? [];
}

/** Products belonging to a specific subcategory. */
export function getProductsBySubcategory(
  categoryId: string,
  subcategoryId: string,
): Product[] {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.subcategories.find((s) => s.id === subcategoryId)?.products ?? [];
}

/** Lookup a single product by SKU. */
export function getProductBySku(sku: string): Product | undefined {
  return allProducts.find((p) => p.sku === sku);
}

/** Text search across product names (case-insensitive). */
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return allProducts;
  return allProducts.filter((p) => p.name.toLowerCase().includes(q));
}

/** All hero banner definitions. */
export function getHeroBanners(): HeroBanner[] {
  return heroBanners;
}

/** All marketing tile definitions. */
export function getMarketingTiles(): MarketingTile[] {
  return marketingTiles;
}

/** Quick stats about the catalog for display purposes. */
export function getCatalogStats() {
  return {
    totalProducts: allProducts.length,
    totalCategories: categories.length,
    totalSubcategories: categories.reduce((n, c) => n + c.subcategories.length, 0),
    ebtEligibleCount: allProducts.filter((p) => p.ebt).length,
  };
}
