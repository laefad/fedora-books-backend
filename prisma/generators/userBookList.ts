import type { PrismaClient } from "@prisma/client";
import { pick, pickMany, generateWords, getFish } from "@/generators/util";

interface GenerateBookListsParams {
    amount: number;
    nameWords: {
        length: {
            min: number;
            max: number;
        };
        amount:  {
            min: number;
            max: number;
        };
    };
    userIDs: Array<string>;
    bookIDs: Array<string>;
    prisma: PrismaClient;
};

export const generateBookLists = async ({
    amount,
    nameWords,
    userIDs,
    bookIDs,
    prisma
}: GenerateBookListsParams): Promise<string[]> => {
    const bookListIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.bookList.create({
            data: {
                name: generateWords(nameWords),
                description: getFish(),
                user: {
                    connect: {
                        id: pick(userIDs)
                    }
                },
                books: {
                    connect: 
                        pickMany(bookIDs)
                        .map(id => ({
                            id
                        }))
                }
            }
        });
        bookListIDs.push(id);
    }

    return bookListIDs;
};
