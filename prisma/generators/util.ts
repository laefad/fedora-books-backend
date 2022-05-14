import { LoremIpsum } from 'lorem-ipsum';
import { rword } from 'rword';

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 20,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    },
    words: rword.words
});

export const randomDate = (start = new Date(1600, 0, 1), end = new Date()) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const getFish = () => lorem.generateParagraphs(1);

export const random = (min: number , max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const pick = <T>(array: Array<T>) => array.at(random(0, array.length - 1));

export const pickMany = <T>(array: Array<T>, coef: number = 0.4301) => array.filter(_ => Math.random() >= coef);

export const generateWords = (options: {
    length: {
        min: number;
        max: number;
    };
    amount?: {
        min: number;
        max: number;
    };
}) => {
    const words = rword.generate(
        options.amount ? random(options.amount.min, options.amount.max) : 1,
        {
            length: `${options.length.min}-${options.length.max}`
        }
    );

    return words instanceof Array ? words.join(' ') : words;
}; 
