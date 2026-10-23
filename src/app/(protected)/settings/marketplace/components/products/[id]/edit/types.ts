import { DraftImage } from "@/src/types/product-image";
import { ProductCondition, ProductStatus } from "@/src/types/product";
import { OptionsDraft } from "@/src/lib/product-options";

export interface EditableSpecification {
  id: string;
  key: string;
  value: string;
}

export interface ProductEditDraft {
  title: string;
  categoryId: string;
  brand: string;
  description: string;
  condition: ProductCondition;
  sku: string;
  status: ProductStatus;

  price: string;
  originalPrice: string;
  stock: string;
  // Size / Colour etc. - when on, stock is set per combination.
  optionsDraft: OptionsDraft;

  highlights: string[];
  specifications: EditableSpecification[];
  images: DraftImage[];
}
