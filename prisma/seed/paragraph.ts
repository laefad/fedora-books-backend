import type { PrismaClient } from "@prisma/client";
import { getFish } from "./util";

interface GenerateParagraphsParams {
    amount: number;
    chapterId: string;
    prisma: PrismaClient;
};

export const generateParagraphs = async ({
    amount,
    chapterId,
    prisma
}: GenerateParagraphsParams): Promise<string[]> => {
    const paragraphIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {
        const { id } = await prisma.paragraph.create({
            data: {
                content: getFish(),
                chapter: {
                    connect: {
                        id: chapterId
                    }
                }
            }
        });
        paragraphIDs.push(id);
    }

    return paragraphIDs;
};
