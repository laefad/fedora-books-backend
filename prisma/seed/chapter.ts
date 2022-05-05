import type { ChapterType, PrismaClient } from "@prisma/client";
import { generateParagraphs } from "./paragraph";
import { generateWords, pick, random } from "./util";

interface GenerateChaptersParams {
    amount: number;
    nested: {
        level: {
            max: number;
            current: number;
        };
        amount: {
            min: number;
            max: number;
        };
        topChapterId?: string;
    };
    paragraphs: {
        min: number;
        max: number;
    };
    nameWords: {
        length: {
            min: number;
            max: number;
        };
        amount:  {
            min: number;
            max: number;
        };
    };
    chapters: {
        min: number;
        max: number;
    };
    bookId: string;
    prisma: PrismaClient;
};

export const generateChapters = async ({
    amount,
    chapters,
    nested,
    nameWords,
    paragraphs,
    bookId,
    prisma
}: GenerateChaptersParams): Promise<string[]> => {
    const chapterTypes: Array<ChapterType>  = ["Default", "Directory"];
    const type = nested.level.current >= nested.level.max ? "Default" : pick(chapterTypes);

    const topChapter = nested.level.current > 0 ? { topChapter: { connect: { id: nested.topChapterId } } } : {};

    const chapterIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {

        console.log(`Creating chapter [${nested.level.current}:${nested.level.max}] ${i}/${amount}...`);

        const { id } = await prisma.chapter.create({
            data: {
                name: generateWords(nameWords),
                type,
                ...topChapter,
                book: { 
                    connect: { 
                        id: bookId 
                    } 
                } 
            }
        });

        if (type == "Directory") {
            await generateChapters({
                amount: random(chapters.min, chapters.max),
                chapters,
                nested: {
                    level: {
                        current: nested.level.current + 1,
                        max: nested.level.max
                    },
                    amount: nested.amount,
                    topChapterId: id
                },
                paragraphs,
                nameWords,
                bookId,
                prisma
            });
        } else {
            await generateParagraphs({
                chapterId: id,
                amount: random(paragraphs.min, paragraphs.max),
                prisma
            });
        }

        chapterIDs.push(id);
    }

    return chapterIDs;
};
