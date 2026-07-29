export interface SavedCard {
  id: string;
  userId: string;
  authorizationCode: string;
  last4: string | null;
  expMonth: string | null;
  expYear: string | null;
  bank: string | null;
  cardType: string | null;
  isDefault: boolean;
  createdAt: string;
}
