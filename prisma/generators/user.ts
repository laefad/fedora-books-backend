import type { PrismaClient } from "@prisma/client";
import { generateWords, pick } from "@/generators/util";
import { UserRole } from "@/generated";

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
                name: generateWords({length: name}),
                password: generateWords({length: password}),
                role: pick([UserRole.Admin, UserRole.Moderator, UserRole.User]) as UserRole,
            }
        });
        userIDs.push(id);
    }

    return userIDs;
};
