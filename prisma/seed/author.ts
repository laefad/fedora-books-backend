import type { PrismaClient } from "@prisma/client";
import { random, randomString } from "./util";

interface GenerateAuthorsParams {
    amount: number;
    length: {
        min: number;
        max: number;
    };
    prisma: PrismaClient;
};

export const generateAuthors = async ({
    amount,
    length: {
        min, 
        max
    },
    prisma
}: GenerateAuthorsParams): Promise<string[]> => {
    const authorIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.author.create({
            data: {
                name: randomString(random(min, max))
            }
        });
        authorIDs.push(id);
    }

    return authorIDs;
};
