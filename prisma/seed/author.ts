import type { PrismaClient } from "@prisma/client";
import { generateWords } from "./util";

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
    length,
    prisma
}: GenerateAuthorsParams): Promise<string[]> => {
    const authorIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.author.create({
            data: {
                name: generateWords({length})
            }
        });
        authorIDs.push(id);
    }

    return authorIDs;
};
