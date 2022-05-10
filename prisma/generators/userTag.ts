import type { PrismaClient } from "@prisma/client";
import { pick, generateWords, getFish } from "@/generators/util";

interface GenerateUserTagsParams {
    amount: number;
    length: {
        min: number;
        max: number;
    };
    userIDs: Array<string>;
    prisma: PrismaClient;
};

export const generateUserTags = async ({
    amount,
    length,
    userIDs,
    prisma
}: GenerateUserTagsParams): Promise<string[]> => {
    const userTagIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.userTag.create({
            data: {
                name: generateWords({length}),
                description: getFish(),
                user: {
                    connect: {
                      id: pick(userIDs)
                    }
                }
            }
        });
        userTagIDs.push(id);
    }

    return userTagIDs;
};
