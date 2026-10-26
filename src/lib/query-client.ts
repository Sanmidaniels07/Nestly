import {
  MutationCache,
  QueryClient,
} from "@tanstack/react-query";

export const queryClient: QueryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus:
          false,
      },
    },
    // A seller's "Finish setting up" banner depends on their store, payout
    // account, delivery zones and products - re-check it after any change
    // (only refetched while the banner is on screen).
    mutationCache: new MutationCache({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["seller", "me", "readiness"] });
      },
    }),
  });
