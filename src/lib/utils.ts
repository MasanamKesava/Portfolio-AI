// src/lib/utils.ts
import { type ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes conditionally, dedupe conflicts.
 * Usage: className={cn("p-2", isActive && "bg-primary")}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
