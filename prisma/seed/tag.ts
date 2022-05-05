import type { PrismaClient } from "@prisma/client";
import { generateWords } from "./util";

interface GenerateTagsParams {
    amount: number;
    length: {
        min: number;
        max: number;
    };
    prisma: PrismaClient;
};

export const generateTags = async ({
    amount,
    length,
    prisma
}: GenerateTagsParams): Promise<string[]> => {
    const tagIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.tag.create({
            data: {
                name: generateWords({length}),
            }
        });
        tagIDs.push(id);
    }

    return tagIDs;
};
