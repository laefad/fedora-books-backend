import type { PrismaClient } from "@prisma/client";
import { random, randomString } from "./util";

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
    length: {
        min, 
        max
    },
    prisma
}: GenerateTagsParams): Promise<string[]> => {
    const tagIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.tag.create({
            data: {
                name: randomString(random(min, max))
            }
        });
        tagIDs.push(id);
    }

    return tagIDs;
};
