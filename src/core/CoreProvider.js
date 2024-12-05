"use client";

/* Next */
import { SessionProvider } from "next-auth/react";

export const CoreProvider = ({ children }) => {
  return (
    <SessionProvider refetchInterval={1 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
};
