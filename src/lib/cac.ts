import { CacCheckResult, CacCompanyType } from "../types/seller";

// The CAC registers a business can be on - picked next to the CAC number so
// it can be looked up automatically.
export const CAC_COMPANY_TYPES: { value: CacCompanyType; label: string; hint: string }[] = [
  { value: "BUSINESS_NAME", label: "Business name", hint: "BN number - e.g. an enterprise or ventures" },
  { value: "COMPANY", label: "Company (Ltd)", hint: "RC number - limited company" },
  { value: "INCORPORATED_TRUSTEES", label: "Incorporated trustees", hint: "IT number - NGO, church, association" },
  { value: "LIMITED_PARTNERSHIP", label: "Limited partnership", hint: "LP number" },
  { value: "LIMITED_LIABILITY_PARTNERSHIP", label: "Limited liability partnership", hint: "LLP number" },
];

export const cacTypeLabel = (type?: CacCompanyType | null) =>
  CAC_COMPANY_TYPES.find((option) => option.value === type)?.label;

const PREFIX_TYPES: [RegExp, CacCompanyType][] = [
  [/^LLP/, "LIMITED_LIABILITY_PARTNERSHIP"],
  [/^LP/, "LIMITED_PARTNERSHIP"],
  [/^BN/, "BUSINESS_NAME"],
  [/^IT/, "INCORPORATED_TRUSTEES"],
  [/^RC/, "COMPANY"],
];

/** The register a typed number's prefix points to (RC -> company, BN -> business name...). */
export const cacTypeFromNumber = (cacNumber: string): CacCompanyType | undefined =>
  PREFIX_TYPES.find(([prefix]) => prefix.test(cacNumber.trim().toUpperCase()))?.[1];

/** How the automatic check's result reads to admins. */
export const CAC_RESULT_LABEL: Record<CacCheckResult, string> = {
  VERIFIED: "Auto-verified",
  AWAITING_STORE: "Found - no store yet",
  NAME_MISMATCH: "Name doesn't match",
  INACTIVE: "Not active",
  NOT_FOUND: "Not found",
  FAILED: "Check failed",
};
