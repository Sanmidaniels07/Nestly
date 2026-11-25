// "Add a new product" from the collection editor: what the seller had in the
// editor is kept here while they fill in the Add product form, and the new
// product's id is handed back, so they return to the same collection with
// the new product already ticked. Kept for this browser tab only, and
// forgotten after two hours (so a later, unrelated product isn't caught up).

export interface CollectionDraft {
  // null while it's a new collection (not saved yet).
  collectionId: string | null;
  name: string;
  description: string;
  picked: string[];
  at: number;
}

const DRAFT_KEY = "nestly:collection-draft";
const NEW_PRODUCT_KEY = "nestly:collection-new-product";
const FRESH_MS = 2 * 60 * 60 * 1000;

const read = <T,>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const saveCollectionDraft = (draft: Omit<CollectionDraft, "at">) => {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, at: Date.now() }));
  } catch {
    // Private mode: they'll just pick the new product by hand afterwards.
  }
};

// Is the seller adding a product for a collection right now?
export const pendingCollectionDraft = (): CollectionDraft | null => {
  const draft = read<CollectionDraft>(DRAFT_KEY);
  return draft && Date.now() - draft.at < FRESH_MS ? draft : null;
};

// The Add product form: the product was published - hand its id back.
export const handBackNewProduct = (productId: string) => {
  try {
    sessionStorage.setItem(NEW_PRODUCT_KEY, JSON.stringify(productId));
  } catch {
    // Ignore - see saveCollectionDraft.
  }
};

// The collections page: the draft, with the new product added if one was
// published. Reading it doesn't forget it (React may render twice) - call
// clearCollectionDraft once it's in the editor.
export const peekCollectionDraft = (): CollectionDraft | null => {
  const draft = pendingCollectionDraft();
  if (!draft) return null;
  const newProduct = read<string>(NEW_PRODUCT_KEY);
  return newProduct && !draft.picked.includes(newProduct) ? { ...draft, picked: [...draft.picked, newProduct] } : draft;
};

export const clearCollectionDraft = () => {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
    sessionStorage.removeItem(NEW_PRODUCT_KEY);
  } catch {
    // Nothing to clear.
  }
};
