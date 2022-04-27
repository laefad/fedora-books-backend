import type { PrismaClient } from "@prisma/client";
import { pick, random, randomString } from "./util";

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
    length: {
        min, 
        max
    },
    userIDs,
    prisma
}: GenerateUserTagsParams): Promise<string[]> => {
    const userTagIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.userTag.create({
            data: {
                name: randomString(random(min, max)),
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
