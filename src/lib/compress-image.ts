// Shrinks big phone photos in the browser before they're uploaded, so uploads
// are faster on mobile data and pages load lighter - without visible quality
// loss. The work happens in a background worker (compress-image.worker.ts) so
// the page never freezes. Rules:
//   - Only JPEG / PNG / WebP photos. GIFs (may be animated) and videos pass through.
//   - Already-small photos pass through untouched (re-saving always costs a little).
//   - The long edge is capped at 2048px (sharp on phones, retina screens and
//     the product zoom view), saved as high-quality JPEG.
//   - PNGs with transparency (logos) stay PNG so the see-through parts survive.
//   - The original goes up instead if: the browser can't shrink in the
//     background (older browsers), anything fails, the result isn't smaller,
//     or it takes longer than TIME_BUDGET_MS.
// Re-encoding also drops the photo's hidden metadata (EXIF), including the GPS
// location phones store - so a seller's photo doesn't reveal where they live.

const SHRINKABLE = ["image/jpeg", "image/png", "image/webp"];

/**
 * Longest we'll hold an upload back for shrinking. A phone usually takes well
 * under a second; on a slow or busy device the original goes up instead, so
 * shrinking can never make an upload much slower than it was before.
 */
const TIME_BUDGET_MS = 4000;

const canShrinkInBackground = () =>
  typeof window !== "undefined" &&
  typeof Worker !== "undefined" &&
  typeof OffscreenCanvas !== "undefined" &&
  typeof createImageBitmap === "function";

export const compressImage = (file: File): Promise<File> => {
  if (!SHRINKABLE.includes(file.type) || !canShrinkInBackground()) return Promise.resolve(file);

  return new Promise<File>((resolve) => {
    let worker: Worker;
    try {
      // One worker per photo: several photos shrink side by side, and each is
      // shut down as soon as it answers (or runs out of time).
      worker = new Worker(new URL("./compress-image.worker.ts", import.meta.url), { type: "module" });
    } catch {
      resolve(file);
      return;
    }
    const finish = (result: File | null) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(result ?? file);
    };
    const timer = setTimeout(() => finish(null), TIME_BUDGET_MS);
    worker.onmessage = (event: MessageEvent<{ file: File | null }>) => finish(event.data.file);
    worker.onerror = () => finish(null);
    worker.postMessage(file);
  });
};

/** compressImage for a batch; videos and other files pass through. */
export const compressImages = (files: File[]) => Promise.all(files.map(compressImage));
