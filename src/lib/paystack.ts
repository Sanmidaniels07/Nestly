export const payWithPaystack = async (
  accessCode: string,
  handlers: {
    onSuccess: (reference: string) => void;
    onCancel: () => void;
    onError?: (message: string) => void;
  }
) => {
  const { default: PaystackPop } = await import("@paystack/inline-js");
  const paystack = new PaystackPop();

  paystack.resumeTransaction(accessCode, {
    onSuccess: (transaction: { reference: string }) =>
      handlers.onSuccess(transaction.reference),
    onCancel: handlers.onCancel,
    onError: (error: { message: string }) => handlers.onError?.(error.message),
  });
};
