import { DraftImage } from "@/src/types/product-image";
import { EditableVariant, ProductCondition, ProductStatus } from "@/src/types/product";

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

  highlights: string[];
  specifications: EditableSpecification[];
  variants: EditableVariant[];
  images: DraftImage[];
}
