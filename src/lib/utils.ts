import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const getHeader = (headers: Headers | Record<string, string> | undefined, key: string): string | null => {
  if (!headers) return null;
  const normalizedKey = key.toLowerCase();
  if (headers instanceof Headers) {
    return headers.get(key) || headers.get(normalizedKey);
  } else if (typeof headers === "object") {
    const foundKey = Object.keys(headers).find(k => k.toLowerCase() === normalizedKey);
    return foundKey ? headers[foundKey] : null;
  }
  return null;
};


const parseHeaderValue = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

export { cn, getHeader, parseHeaderValue };
