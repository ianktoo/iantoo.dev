"use client";

import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <Button variant="ghost" size="sm" onClick={toggle} title="Toggle theme">
      {theme === "normal" ? ">_" : "normal"}
    </Button>
  );
}
