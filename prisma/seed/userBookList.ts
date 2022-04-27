import type { PrismaClient } from "@prisma/client";
import { pick, pickMany, random, randomString } from "./util";

interface GenerateBookListsParams {
    amount: number;
    length: {
        min: number;
        max: number;
    };
    userIDs: Array<string>;
    bookIDs: Array<string>;
    prisma: PrismaClient;
};

export const generateBookLists = async ({
    amount,
    length: {
        min, 
        max
    },
    userIDs,
    bookIDs,
    prisma
}: GenerateBookListsParams): Promise<string[]> => {
    const bookListIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.bookList.create({
            data: {
                name: randomString(random(min, max)),
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
