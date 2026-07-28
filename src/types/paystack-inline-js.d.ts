declare module "@paystack/inline-js" {
  interface PaystackTransaction {
    id?: number;
    reference: string;
    message?: string;
  }

  interface PaystackError {
    message: string;
  }

  interface ResumeTransactionCallbacks {
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
    onError?: (error: PaystackError) => void;
    onLoad?: (transaction: PaystackTransaction) => void;
  }

  export default class PaystackPop {
    resumeTransaction(accessCode: string, callbacks: ResumeTransactionCallbacks): unknown;
  }
}
