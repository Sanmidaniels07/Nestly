import { isStaging } from "@/src/lib/environment";
import { serverGet } from "@/src/lib/server-api";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";

// Product feed for Google Merchant Center, so live products can show in
// Google Shopping (free listings). Add this URL as a scheduled feed in
// Merchant Center: https://www.nestlyapp.site/feeds/google-merchant.xml
// Refreshed hourly. Staging serves an empty feed.

export const revalidate = 3600;

interface FeedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
  condition: string;
  brand: string | null;
  images: string[];
  category: string;
  storeName: string;
}

const xml = (value: string) =>
  value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const money = (value: number) => `${value.toFixed(2)} NGN`;

// Google only knows new, used and refurbished.
const condition = (value: string) => (value === "USED" ? "used" : value === "REFURBISHED" ? "refurbished" : "new");

const item = (p: FeedProduct) => {
  const onSale = !!p.originalPrice && p.originalPrice > p.price;
  const lines = [
    `<g:id>${xml(p.id)}</g:id>`,
    `<g:title>${xml(p.title.slice(0, 150))}</g:title>`,
    `<g:description>${xml((p.description || p.title).slice(0, 5000))}</g:description>`,
    `<g:link>${SITE_URL}/marketplace/product/${encodeURIComponent(p.id)}</g:link>`,
    `<g:image_link>${xml(p.images[0])}</g:image_link>`,
    ...p.images.slice(1, 11).map((url) => `<g:additional_image_link>${xml(url)}</g:additional_image_link>`),
    `<g:availability>${p.inStock ? "in_stock" : "out_of_stock"}</g:availability>`,
    // On sale: the compare-at price is the regular price, the current one the sale price.
    `<g:price>${money(onSale ? (p.originalPrice as number) : p.price)}</g:price>`,
    ...(onSale ? [`<g:sale_price>${money(p.price)}</g:sale_price>`] : []),
    `<g:condition>${condition(p.condition)}</g:condition>`,
    // Handmade and small-business goods rarely have a brand or barcode;
    // the store is the brand.
    `<g:brand>${xml(p.brand?.trim() || p.storeName)}</g:brand>`,
    `<g:identifier_exists>no</g:identifier_exists>`,
    `<g:product_type>${xml(p.category)}</g:product_type>`,
    `<g:custom_label_0>${xml(p.storeName)}</g:custom_label_0>`,
  ];
  return `    <item>\n      ${lines.join("\n      ")}\n    </item>`;
};

export async function GET() {
  const products = isStaging
    ? []
    : ((await serverGet<{ products: FeedProduct[] }>("/seo/merchant-feed", revalidate))?.data.products ?? []);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xml(SITE_NAME)} products</title>
    <link>${SITE_URL}</link>
    <description>Products from sellers on ${xml(SITE_NAME)}</description>
${products.filter((p) => p.images.length > 0).map(item).join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
}
