/**
 * Product image CDN URLs used across WCP pattern demos.
 *
 * The original set pointed at a `cdn.builder.io`/`api.builder.io` asset
 * account that is no longer reachable. Entries with a genuine equivalent in
 * `src/data/productCatalog.json` now point at that (verified, working)
 * `i5.walmartimages.com` image instead; everything else falls back to
 * `walmartPlaceholder` (a local data URI, no network dependency) rather than
 * show a mismatched or broken photo.
 */
// Walmart no-image placeholder (spark on gray background)
const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f5f5f5'/%3E%3Cg transform='translate(200,175)'%3E%3Ccircle r='4' fill='%23FFC220'/%3E%3Cg fill='%23FFC220'%3E%3Crect x='-3.5' y='-24' width='7' height='19' rx='3.5'/%3E%3Crect x='-3.5' y='5' width='7' height='19' rx='3.5'/%3E%3Crect x='-3.5' y='-24' width='7' height='19' rx='3.5' transform='rotate(60)'/%3E%3Crect x='-3.5' y='5' width='7' height='19' rx='3.5' transform='rotate(60)'/%3E%3Crect x='-3.5' y='-24' width='7' height='19' rx='3.5' transform='rotate(-60)'/%3E%3Crect x='-3.5' y='5' width='7' height='19' rx='3.5' transform='rotate(-60)'/%3E%3C/g%3E%3C/g%3E%3Ctext x='200' y='225' text-anchor='middle' font-family='system-ui,sans-serif' font-size='13' fill='%2374767c'%3EImage not available%3C/text%3E%3C/svg%3E";

export const PRODUCT_IMAGES = {
  airFryer:
    'https://i5.walmartimages.com/seo/Beautiful-6-0-QT-Air-Fryer-Touchscreen-White-Icing-by-Drew-Barrymore_6dbe3973-0fe5-4497-af08-440582489049.bdefddc6b03421093f30c77e4fb81dc7.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
  digitalCamera: PLACEHOLDER_SVG,
  tablet: PLACEHOLDER_SVG,
  headphones:
    'https://i5.walmartimages.com/seo/JLab-Go-Air-Pop-True-Wireless-Earbuds-w-Charging-Case-Black_7766c8d7-7d73-48c6-ac09-faac88b01b07.39c4aa643a1d8129cffe738ea1c10ee9.jpeg',
  blackCardigan: PLACEHOLDER_SVG,
  leatherHandbag: PLACEHOLDER_SVG,
  rattanCabinet: PLACEHOLDER_SVG,
  hoboBagGreen: PLACEHOLDER_SVG,
  hoboBagBrown: PLACEHOLDER_SVG,
  brownTote: PLACEHOLDER_SVG,
  ivoryToteSet: PLACEHOLDER_SVG,
  mkMonogramSet: PLACEHOLDER_SVG,
  cordlessVacuum: PLACEHOLDER_SVG,
  comforterSet: PLACEHOLDER_SVG,
  cookwareSet: PLACEHOLDER_SVG,
  mugSet: PLACEHOLDER_SVG,
  boucleArmchair:
    'https://i5.walmartimages.com/seo/Beautiful-Drew-Accent-Chair-by-Drew-Barrymore-Sage-Boucle_9d213700-b268-4b28-9ac8-db83ee9f1a33.78791dd0be9fce612b27dd51f5630012.jpeg',
  pinkSofaBed: PLACEHOLDER_SVG,
  leatherArmchairDetail:
    'https://i5.walmartimages.com/seo/Beautiful-Drew-Accent-Chair-by-Drew-Barrymore-Sage-Boucle_9d213700-b268-4b28-9ac8-db83ee9f1a33.78791dd0be9fce612b27dd51f5630012.jpeg',
  leatherArmchair:
    'https://i5.walmartimages.com/seo/Beautiful-Drew-Accent-Chair-by-Drew-Barrymore-Sage-Boucle_9d213700-b268-4b28-9ac8-db83ee9f1a33.78791dd0be9fce612b27dd51f5630012.jpeg',
  countertopBlender: PLACEHOLDER_SVG,
  handBlenderSet: PLACEHOLDER_SVG,
  blenderSystem: PLACEHOLDER_SVG,
  personalBlender: PLACEHOLDER_SVG,
  roomba1: PLACEHOLDER_SVG,
  roomba2: PLACEHOLDER_SVG,
  roomba3: PLACEHOLDER_SVG,
  roomba4: PLACEHOLDER_SVG,
  laptop1:
    'https://i5.walmartimages.com/seo/ASUS-Vivobook-Go-15-15-6-FHD-PC-Laptop-with-AMD-Ryzen-X-XXXX-AMD-Radeon-Graphics-8GB-RAM-512GB-SSD-Mixed-Black_1c364528-f395-451a-bcb6-1139ded100bf.0a985ae2def759e8d4bc5e1f1a1e7c57.jpeg',
  laptop2:
    'https://i5.walmartimages.com/seo/Acer-Chromebook-315-15-6-inch-Laptop-Intel-Processor-N4500-4GB-RAM-64GB-eMMC-Pure-Silver-ChromeOS_e9b49ec2-6204-434c-841b-e4dbd1846431.c146aa580b8b9806ef9eb45067ae5094.jpeg',
  laptop3:
    'https://i5.walmartimages.com/seo/HP-Stream-14-inch-Windows-Laptop-Intel-Processor-N150-4GB-128GB-eMMC-Pink-12-mo-Microsoft-365-included_82b98986-afdd-40c3-a2d5-b0355110c65d.8403d90bb2cc57ab6d11c1b93eab4f44.jpeg',
  laptop4:
    'https://i5.walmartimages.com/seo/Lenovo-IdeaPad-Slim-3i-15-6-Laptop-Intel-Processor-N100-4GB-RAM-128-SSD-Aric-Grey_bbcf7b2a-9591-4bb7-859a-39654b54ef5b.f0f0a7bd518fa2f3ea8d70f9e14870fc.jpeg',
  starbucksDoubleshot: PLACEHOLDER_SVG,
  bettergooodsFruitSnacks: PLACEHOLDER_SVG,
  eggs6Count: PLACEHOLDER_SVG,
  oatlyOatMilk: PLACEHOLDER_SVG,
  bettergoodsCarrotJuice: PLACEHOLDER_SVG,
  skinnyPopPopcorn: PLACEHOLDER_SVG,
  kikkomanSoySauce: PLACEHOLDER_SVG,
  goodCultureCottageCheese: PLACEHOLDER_SVG,
  bettergoodsFrozenMeal: PLACEHOLDER_SVG,
  freshStrawberries:
    'https://i5.walmartimages.com/seo/Fresh-Strawberries-1-lb-Container_b54a64ad-e961-46cf-b60c-bc763716fb0b.a481cdfd237c5ab5438d5c9e90bead07.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
  bettergoodsSalsa: PLACEHOLDER_SVG,
  redApple: PLACEHOLDER_SVG,
  flashEarrings: PLACEHOLDER_SVG,
  flashShampoo: PLACEHOLDER_SVG,
  flashHumidifier: PLACEHOLDER_SVG,
  flashTankTops: PLACEHOLDER_SVG,
  flashLaptop:
    'https://i5.walmartimages.com/seo/HP-Omnibook-5-16-inch-Windows-Laptop-AMD-Ryzen-7-AI-PC-16GB-RAM-512GB-SSD-Glacier-Silver_36bc9dcd-4182-4cfb-a86b-05aed1ae3e64.32b35980d9afba50905479bc112df6f5.jpeg',
  flashExerciseBike: PLACEHOLDER_SVG,
  // Both Cheerios URLs 404 against the live CDN (no verified equivalent in
  // productCatalog.json) — fall back to the placeholder rather than show a
  // broken image, per the policy above.
  cheerios: PLACEHOLDER_SVG,
  honeyNutCheerios: PLACEHOLDER_SVG,
  // Grocery product images (used by order card patterns)
  milk: PLACEHOLDER_SVG,
  eggs: PLACEHOLDER_SVG,
  bananas: PLACEHOLDER_SVG,
  avocado: PLACEHOLDER_SVG,
  blueberries:
    'https://i5.walmartimages.com/seo/Fresh-Blueberries-18-oz-Container_360bdfc2-2e26-4916-b0d0-222252d8c500.82c1f7e52cb1713e63d7752f801a26b2.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
  strawberries:
    'https://i5.walmartimages.com/seo/Fresh-Strawberries-2-lb-Container_dd2bcd97-25af-4a91-9258-989853e16b2f_1.36dd4f1579a25d423741d9970de3ddac.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
  walmartPlaceholder: PLACEHOLDER_SVG,
} as const;
