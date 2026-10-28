import { Notification } from "../types/notification";

// The page a notification opens - used by the notification list and by
// tapped push notifications (/notifications/open).
export function targetHref(notification: Pick<Notification, "targetType" | "targetId">): string | null {
  switch (notification.targetType) {
    case "POST":
      return notification.targetId ? `/post/${notification.targetId}` : null;
    case "USER":
    case "BIRTHDAY":
      return notification.targetId ? `/users/${notification.targetId}` : null;
    case "CONVERSATION":
      return notification.targetId ? `/messages/${notification.targetId}` : null;
    case "PRODUCT":
      return notification.targetId
        ? `/settings/marketplace/components/products/${notification.targetId}/edit`
        : null;
    case "SELLER_APPLICATION":
      return "/marketplace/sell";
    case "COMMISSION_CHANGE":
      return "/settings/marketplace?tab=products";
    case "ADMIN_SELLER_APPLICATION":
    case "ADMIN_CAC_SUBMITTED":
      return "/admin?tab=sellers";
    case "SELLER_SETUP":
      return "/settings/marketplace";
    case "PROFILE_SETUP":
      return "/dashboard?checklist=1";
    case "CAC_REMINDER":
      return "/settings/marketplace?cac=1";
    case "ADMIN_PAYOUT_ACCOUNT_CHANGED":
    case "ADMIN_REFUND_NEEDED":
      return "/admin?tab=payouts";
    case "ORDER":
      return notification.targetId ? `/marketplace/orders/${notification.targetId}` : "/marketplace/orders";
    // Shopping updates: a product (store page view, not the seller's editor),
    // a store (targetId is its slug) or the cart.
    case "PRODUCT_PAGE":
      return notification.targetId ? `/marketplace/product/${notification.targetId}` : null;
    case "STORE_PAGE":
      return notification.targetId ? `/marketplace/seller/${notification.targetId}` : null;
    case "CART":
      return "/marketplace/cart";
    case "SELLER_ORDER":
      return notification.targetId
        ? `/settings/marketplace?tab=orders&order=${notification.targetId}`
        : "/settings/marketplace?tab=orders";
    default:
      return null;
  }
}
