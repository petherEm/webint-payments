"use client";

import { enableVisualEditing } from "@sanity/visual-editing";
import { useEffect } from "react";

export default function VisualEditing() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      enableVisualEditing();
    }
  }, []);

  return null;
}
