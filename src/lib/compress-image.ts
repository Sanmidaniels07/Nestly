// Shrinks big phone photos in the browser before they're uploaded, so uploads
// are faster on mobile data and pages load lighter - without visible quality
// loss. Rules, in order:
//   - Only JPEG / PNG / WebP photos. GIFs (may be animated) and videos pass through.
//   - Already-small photos pass through untouched (re-saving always costs a little).
//   - The long edge is capped at MAX_EDGE (2048px: sharp on phones, retina
//     screens and the product zoom view), saved as high-quality JPEG.
//   - PNGs with transparency (logos) stay PNG so the see-through parts survive.
//   - If anything fails, or the result isn't actually smaller, the original goes up.
// Re-encoding also drops the photo's hidden metadata (EXIF), including the GPS
// location phones store - so a seller's photo doesn't reveal where they live.

const MAX_EDGE = 2048;
const JPEG_QUALITY = 0.86;
/** Photos at or under both limits are left exactly as they are. */
const SMALL_BYTES = 1.2 * 1024 * 1024;

const SHRINKABLE = ["image/jpeg", "image/png", "image/webp"];

type Decoded = { source: CanvasImageSource; width: number; height: number; close: () => void };

const decode = async (file: File): Promise<Decoded> => {
  // createImageBitmap applies the EXIF rotation, so sideways phone photos stay upright.
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      // fall back to <img> (older Safari)
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
};

/**
 * Checks a 64x64 copy for see-through pixels - enough to spot a transparent
 * background, and cheap: reading every pixel of a full-size canvas back from
 * the GPU took seconds on slow devices.
 */
const hasTransparency = (source: CanvasImageSource) => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true; // can't tell: keep PNG to be safe
  ctx.drawImage(source, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) return true;
  return false;
};

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * Longest we'll hold an upload back for shrinking. A phone usually takes well
 * under a second; on a slow or busy device the original goes up instead, so
 * shrinking can never make an upload much slower than it was before.
 */
const TIME_BUDGET_MS = 4000;

export const compressImage = (file: File): Promise<File> => {
  if (typeof window === "undefined" || !SHRINKABLE.includes(file.type)) return Promise.resolve(file);
  return Promise.race([
    shrink(file),
    new Promise<File>((resolve) => setTimeout(() => resolve(file), TIME_BUDGET_MS)),
  ]);
};

const shrink = async (file: File): Promise<File> => {

  let decoded: Decoded | null = null;
  try {
    decoded = await decode(file);
    const { width, height } = decoded;
    const longEdge = Math.max(width, height);
    if (longEdge <= MAX_EDGE && file.size <= SMALL_BYTES) return file;

    const scale = Math.min(1, MAX_EDGE / longEdge);
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(decoded.source, 0, 0, w, h);

    // PNG / WebP with see-through parts (logos) stay PNG; everything else becomes JPEG.
    const type = file.type !== "image/jpeg" && hasTransparency(decoded.source) ? "image/png" : "image/jpeg";
    const blob = await toBlob(canvas, type, type === "image/jpeg" ? JPEG_QUALITY : undefined);
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.${type === "image/png" ? "png" : "jpg"}`, { type, lastModified: file.lastModified });
  } catch {
    return file;
  } finally {
    decoded?.close();
  }
};

/** compressImage for a batch; videos and other files pass through. */
export const compressImages = (files: File[]) => Promise.all(files.map(compressImage));
