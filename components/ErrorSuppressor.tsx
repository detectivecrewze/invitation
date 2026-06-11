"use client";

import { useEffect } from "react";

export default function ErrorSuppressor() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalError = console.error;
      console.error = (...args) => {
        if (
          typeof args[0] === "string" &&
          (args[0].includes("Failed to get initial state") || args[0].includes("epapihdplajcdnnkdeiahlgigofloibg"))
        ) {
          // Ignore specific extension error
          return;
        }
        originalError.apply(console, args);
      };
    }
  }, []);

  return null;
}
