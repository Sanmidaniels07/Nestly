// After a seller changes what buyers see on a listed product (photos, name,
// description, price, options...), it's off the marketplace for a few
// minutes before it's back on sale (the API's utils/productCooldown).
// Stock-only changes don't hide it.
export const UPDATE_COOLDOWN_MINUTES = 5;

// "2:05 pm" - when an updating product is back on sale.
export const relistTime = (relistAt?: string | null) =>
  relistAt ? new Date(relistAt).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" }).toLowerCase() : null;

interface Comparable {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  condition: string;
  brand: string;
  categoryId: string;
  highlights: string[];
  specifications: { key: string; value: string }[];
  images: { url?: string; preview: string; isCover: boolean }[];
  optionsDraft: unknown;
}

// What buyers judge it by - stock left out (restocking doesn't hide it).
const buyerFacing = (d: Comparable) =>
  JSON.stringify({
    title: d.title.trim(),
    description: d.description.trim(),
    price: d.price,
    originalPrice: d.originalPrice,
    condition: d.condition,
    brand: d.brand.trim(),
    categoryId: d.categoryId,
    highlights: d.highlights,
    specifications: d.specifications.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()]),
    images: d.images.map((i) => [i.url ?? i.preview, i.isCover]),
    options: JSON.parse(JSON.stringify(d.optionsDraft ?? null), (key, value) => (key === "stock" ? undefined : value)),
  });

export const changesWhatBuyersSee = (before: Comparable, after: Comparable) => buyerFacing(before) !== buyerFacing(after);
