// Background worker for lib/compress-image.ts: opens, resizes and re-saves a
// photo off the main thread, so the page never freezes while big photos are
// being shrunk. Answers { file } with the smaller photo, or { file: null } to
// mean "upload the original".

const MAX_EDGE = 2048;
const JPEG_QUALITY = 0.86;
const SMALL_BYTES = 1.2 * 1024 * 1024;

/** Checks a 64x64 copy for see-through pixels (a transparent logo background). */
const hasTransparency = (bitmap: ImageBitmap) => {
  const size = 64;
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true; // can't tell: keep PNG to be safe
  ctx.drawImage(bitmap, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) return true;
  return false;
};

self.onmessage = async (event: MessageEvent<File>) => {
  const file = event.data;
  let bitmap: ImageBitmap | null = null;
  try {
    // "from-image" applies the EXIF rotation, so sideways phone photos stay upright.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const longEdge = Math.max(bitmap.width, bitmap.height);
    if (longEdge <= MAX_EDGE && file.size <= SMALL_BYTES) {
      self.postMessage({ file: null });
      return;
    }

    const scale = Math.min(1, MAX_EDGE / longEdge);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      self.postMessage({ file: null });
      return;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);

    // PNG / WebP with see-through parts (logos) stay PNG; everything else becomes JPEG.
    const type = file.type !== "image/jpeg" && hasTransparency(bitmap) ? "image/png" : "image/jpeg";
    const blob = await canvas.convertToBlob(type === "image/jpeg" ? { type, quality: JPEG_QUALITY } : { type });
    if (blob.size >= file.size) {
      self.postMessage({ file: null });
      return;
    }
    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    self.postMessage({ file: new File([blob], `${base}.${type === "image/png" ? "png" : "jpg"}`, { type, lastModified: file.lastModified }) });
  } catch {
    self.postMessage({ file: null });
  } finally {
    bitmap?.close();
  }
};
