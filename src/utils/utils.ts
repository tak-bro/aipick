import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';

export const createAsyncDelay = (duration: number) => {
    return new Promise<void>(resolve => setTimeout(() => resolve(), duration));
};

export const capitalizeFirstLetter = (text: string) => (text ? `${text[0].toUpperCase()}${text.slice(1)}` : text);

export const getRandomNumber = (min: number, max: number): number => {
    const minValue = Math.ceil(min);
    const maxValue = Math.floor(max);
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

export async function* toObservable<T>(promiseAsyncGenerator: Promise<AsyncGenerator<T>>): AsyncGenerator<T> {
    const asyncGenerator = await promiseAsyncGenerator;
    for await (const value of asyncGenerator) {
        yield value;
    }
}

export const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
        return str.slice(0, maxLength);
    } else {
        return str;
    }
};

export const sortByDisabled = (a: ReactiveListChoice, b: ReactiveListChoice) => {
    if (a.disabled && !b.disabled) {
        return 1;
    }
    if (!a.disabled && b.disabled) {
        return -1;
    }
    return 0;
};

export const flattenArray = (arr: any[]): string[] => {
    return arr.reduce<string[]>((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
};

export const getFirstWordsFrom = (input: string, wordCount: number = 5): string => {
    const sanitizedInput = input.replace(/[\n\r]/g, '');
    const words = sanitizedInput.split(' ');
    const firstFiveWords = words.slice(0, wordCount);
    return firstFiveWords.join(' ');
};
