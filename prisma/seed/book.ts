import type { Book, PrismaClient } from "@prisma/client";
import { getFish, pickMany, random, randomDate } from "./util";

interface GenerateBooksParams {
    booksAmount: number;
    paragraphs: {
        min: number;
        max: number;
    };
    chapters: {
        min: number;
        max: number;
    };
    tagIDs: Array<string>;
    userTagIDs: Array<string>;
    authorIDs: Array<string>,
    prisma: PrismaClient
};
  
export const generateBooks = async ({
    booksAmount, 
    paragraphs: {
        min: minParagraphs,
        max: maxParagraphs
    },
    chapters: {
        min: minChapters,
        max: maxChapters
    },
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

    // TODO replace to text.ts
  
    const generateAndLinkContent = async ({id}: Book) => {
        for (let i = 0, chapters = random(minChapters, maxChapters); i <= chapters; i++) {
            const h = await prisma.text.create({
                data: {
                    content: `The ${i} chapter`,
                    type: "Heading",
                    book: {
                        connect: {
                            id
                        }
                    }
                }
            });
            for (let j = 0, paragraphs = random(minParagraphs, maxParagraphs); j <= paragraphs; j++) {
                const p = await prisma.text.create({
                    data: {
                        content: getFish(),
                        type: "Text",
                        book: {
                            connect: {
                                id
                            }
                        }
                    }
                });
            }
        }
    };

    const bookIDs: Array<string> = [];
  
    for (let i = 0; i <= booksAmount; i++) {
        const book = await createBook(`Book ${i}`);
        bookIDs.push(book.id);
        await generateAndLinkContent(book);
    }

    return bookIDs;
}
