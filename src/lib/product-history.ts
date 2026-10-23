// Mirrors the backend rule (utils/productHistory.ts): a new category or a
// mostly different title turns a listing into a different product, and
// its existing reviews get labelled as for an earlier version.

const words = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((word) => word.length > 1)
  );

export const titleSimilarity = (a: string, b: string) => {
  const left = words(a);
  const right = words(b);
  if (left.size === 0 && right.size === 0) return 1;
  const shared = [...left].filter((word) => right.has(word)).length;
  return shared / new Set([...left, ...right]).size;
};

export const isDifferentProduct = (
  before: { title: string; categoryId: string },
  after: { title: string; categoryId: string }
) => before.categoryId !== after.categoryId || titleSimilarity(before.title, after.title) < 0.5;
