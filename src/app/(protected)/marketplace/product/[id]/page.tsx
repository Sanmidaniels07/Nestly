import { nearbyProducts } from "@/src/mocks/marketplace";
import ProductBreadcrumb from "./components/breadcrumb";
import ProductGallery from "./components/product-gallery";
import ProductInfo from "./components/product-info";
import BuyBox from "./components/buy-box";
import SellerSummary from "./components/seller-summary";
import ProductSpecifications from "./components/product-specifications";
import ProductDescription from "./components/product-description";
import ProductReviews from "./components/product-reviews";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;

  const product = nearbyProducts.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-[15px] font-medium text-[#13131A]">
          Product not found
        </p>
        <p className="mt-1 text-[14px] text-[#64748B]">
          This listing may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ProductBreadcrumb product={product} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr_360px]">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
        <BuyBox product={product} />
      </div>
      <SellerSummary seller={product.seller} />
      <ProductDescription product={product} />

      <ProductSpecifications product={product} />
      <ProductReviews product={product} />

    </div>
  );
}
