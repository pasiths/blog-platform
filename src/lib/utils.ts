import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IsSession = false;
export const IsReader = false && IsSession;
export const IsAdmin = false && IsSession;
export const IsEditor = (false && IsSession) || IsAdmin;
