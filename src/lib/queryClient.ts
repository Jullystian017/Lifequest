import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,        // data fresh for 30s — no refetch on page switch
            gcTime: 5 * 60_000,       // keep in cache for 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
