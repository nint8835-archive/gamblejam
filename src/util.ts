import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function countNumbers(arr: number[]): Map<number, number> {
    const counts = new Map<number, number>();

    arr.forEach((num) => {
        counts.set(num, (counts.get(num) ?? 0) + 1);
    });

    return counts;
}
