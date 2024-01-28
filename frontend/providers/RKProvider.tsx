import React, { useEffect } from "react";
import Constants from "expo-constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";





/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const localhost = Constants.manifest?.debuggerHost?.split(":")[0];

  if (!localhost) {
    return "";
  }
  return ""
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const RKProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {


  const [queryClient] = React.useState<QueryClient>(() => new QueryClient({
    
  }));
 
  

  return (
    
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

  );
}