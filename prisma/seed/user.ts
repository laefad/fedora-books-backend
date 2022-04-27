import type { PrismaClient } from "@prisma/client";
import { random, randomString } from "./util";

interface GenerateUsersParams {
    amount: number;
    length: {
        name: {
            min: number;
            max: number;
        };
        password: {
            min: number;
            max: number;
        };
    };
    prisma: PrismaClient;
};

export const generateUsers = async ({
    amount,
    length: {
        name,
        password
    },
    prisma
}: GenerateUsersParams): Promise<string[]> => {
    const userIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.user.create({
            data: {
                name: randomString(random(name.min, name.max)),
                password: randomString(random(password.min, password.max)),
            }
        });
        userIDs.push(id);
    }

    return userIDs;
};
