import QRCode from "qrcode";

// Images sellers can post to promote their Nestly store: a 1080x1920 story
// card (logo, name, a few products, QR code) and a printable QR code. Drawn
// in the browser on a canvas - nothing is uploaded.

interface StoryInput {
  storeName: string;
  location?: string | null;
  url: string;
  logo?: string | null;
  productImages: string[];
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const fontFamily = () =>
  (typeof document !== "undefined" && getComputedStyle(document.body).fontFamily) || "system-ui, sans-serif";

// Cover-fit an image into a rounded box.
const drawCover = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, w: number, h: number, r: number) => {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();
  const scale = Math.max(w / image.width, h / image.height);
  const dw = image.width * scale;
  const dh = image.height * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
};

const fitText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let clipped = text;
  while (clipped.length > 1 && ctx.measureText(`${clipped}…`).width > maxWidth) clipped = clipped.slice(0, -1);
  return `${clipped}…`;
};

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't create the image"))), "image/png"));

export async function storyImage({ storeName, location, url, logo, productImages }: StoryInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d")!;
  const font = fontFamily();

  // Background - Nestly violet.
  const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, "#6D28D9");
  bg.addColorStop(1, "#4338CA");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `600 40px ${font}`;
  ctx.fillText("NOW ON NESTLY", 540, 170);

  // Logo (or initial).
  const logoImage = logo ? await loadImage(logo) : null;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(540, 360, 130, 0, Math.PI * 2);
  ctx.fill();
  if (logoImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 360, 120, 0, Math.PI * 2);
    ctx.clip();
    drawCover(ctx, logoImage, 420, 240, 240, 240, 0);
    ctx.restore();
  } else {
    ctx.fillStyle = "#6D28D9";
    ctx.font = `700 120px ${font}`;
    ctx.fillText(storeName.charAt(0).toUpperCase(), 540, 405);
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 78px ${font}`;
  ctx.fillText(fitText(ctx, storeName, 960), 540, 600);
  if (location) {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = `500 42px ${font}`;
    ctx.fillText(fitText(ctx, location, 900), 540, 670);
  }

  // Up to three product photos.
  const images = (await Promise.all(productImages.slice(0, 3).map(loadImage))).filter(Boolean) as HTMLImageElement[];
  if (images.length > 0) {
    const size = images.length === 1 ? 560 : images.length === 2 ? 420 : 300;
    const gap = 30;
    const total = images.length * size + (images.length - 1) * gap;
    images.forEach((image, i) => drawCover(ctx, image, (1080 - total) / 2 + i * (size + gap), 760, size, size, 36));
  }

  // QR card.
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, url, { width: 340, margin: 1, color: { dark: "#13131A", light: "#FFFFFF" } });
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(330, 1380, 420, 420, 40);
  ctx.fill();
  ctx.drawImage(qr, 370, 1420, 340, 340);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `600 44px ${font}`;
  ctx.fillText("Scan or tap the link to shop", 540, 1300);

  return toBlob(canvas);
}

// A plain QR code with the store name - for packaging, flyers, the shop.
export async function qrImage(url: string, storeName: string): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1180;
  const ctx = canvas.getContext("2d")!;
  const font = fontFamily();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 1000, 1180);
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, url, { width: 860, margin: 2, color: { dark: "#13131A", light: "#FFFFFF" } });
  ctx.drawImage(qr, 70, 50);
  ctx.textAlign = "center";
  ctx.fillStyle = "#13131A";
  ctx.font = `700 52px ${font}`;
  ctx.fillText(fitText(ctx, storeName, 900), 500, 1000);
  ctx.fillStyle = "#6D28D9";
  ctx.font = `500 36px ${font}`;
  ctx.fillText("Shop on Nestly", 500, 1070);
  return toBlob(canvas);
}

export const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 5000);
};
