import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type NumberCounts = {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
};

export function countNumbers(arr: number[]): NumberCounts {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    arr.forEach((num) => {
        counts[num as keyof NumberCounts] += 1;
    });

    return counts;
}

export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function combinations<T>(array: T[], n: number): T[][] {
    if (n === 0) {
        return [[]];
    }

    if (array.length === 0) {
        return [];
    }

    const [first, ...rest] = array;
    const withFirst = combinations(rest, n - 1).map((comb) => [first, ...comb]);
    const withoutFirst = combinations(rest, n);

    return withFirst.concat(withoutFirst);
}

console.log(combinations([1, 2, 3, 4, 5], 3));
