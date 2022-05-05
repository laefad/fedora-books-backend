import type { PrismaClient } from "@prisma/client";
import { generateChapters } from "./chapter";
import { generateWords, pickMany, random, randomDate } from "./util";

interface GenerateBooksParams {
    booksAmount: number;
    bookNameWords: {
        length: {
            min: number;
            max: number;
        };
        amount: {
            min: number;
            max: number;
        };
    };
    paragraphs: {
        amount: {
            min: number;
            max: number;
        };
        nameWords: {
            length: {
                min: number;
                max: number;
            };
            amount: {
                min: number;
                max: number;
            };
        };
    };
    chapters: {
        min: number;
        max: number;
    };
    maxNested: number;
    tagIDs: Array<string>;
    userTagIDs: Array<string>;
    authorIDs: Array<string>,
    prisma: PrismaClient
};
  
export const generateBooks = async ({
    booksAmount, 
    bookNameWords,
    paragraphs,
    chapters,
    maxNested,
    tagIDs,
    userTagIDs,
    authorIDs,
    prisma
}: GenerateBooksParams): Promise<string[]> => {
  
    const createBook = async (name: string) => await prisma.book.create({
        data: {
            name,
            publishedAt: randomDate(),
            tags: {
            connect: 
                pickMany(tagIDs)
                .map(id => ({
                    id
                }))
            },
            authors: {
            connect: 
                pickMany(authorIDs)
                .map(id => ({
                    id
                }))
            },
            userTags: {
            connect: 
                pickMany(userTagIDs)
                .map(id => ({
                    id
                }))
            }
        }
    });

    const bookIDs: Array<string> = [];
  
    for (let i = 0; i <= booksAmount; i++) {
        console.log(`Creating book ${i}...`);
        const { id } = await createBook(generateWords(bookNameWords));
        bookIDs.push(id);
        await generateChapters({
            amount: random(chapters.min, chapters.max),
            chapters,
            paragraphs: paragraphs.amount,
            nameWords: paragraphs.nameWords,
            nested: {
                level: {
                    max: maxNested,
                    current: 0
                },
                amount: chapters
            },
            bookId: id,
            prisma
        });
    }

    return bookIDs;
}
