import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Penggabung className standar shadcn/ui. */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
