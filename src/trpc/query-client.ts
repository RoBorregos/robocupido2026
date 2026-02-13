import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // Increased to 60 seconds to reduce API calls
        gcTime: 5 * 60 * 1000, // Garbage collect after 5 minutes
        refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
        refetchOnReconnect: false, // Disable refetch on reconnect
        retry: (failureCount, error) => {
          // Don't retry on UNAUTHORIZED errors - redirect to home instead
          if (
            error &&
            typeof error === "object" &&
            "data" in error &&
            (error as { data?: { code?: string } }).data?.code === "UNAUTHORIZED"
          ) {
            // Redirect to home page
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
            return false;
          }
          // Default retry behavior for other errors (max 3 retries)
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
        onError: (error) => {
          // Redirect to home on UNAUTHORIZED mutation errors
          if (
            error &&
            typeof error === "object" &&
            "data" in error &&
            (error as { data?: { code?: string } }).data?.code === "UNAUTHORIZED"
          ) {
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          }
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
