import type { ChapterType, PrismaClient } from "@prisma/client";
import { generateParagraphs } from "@/generators/paragraph";
import { generateWords, pick, random } from "@/generators/util";

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
    prevChapterId?: string;
    bookId: string;
    prisma: PrismaClient;
};

interface GenerateChaptersOutput {
    chapterIDs: string[];
    prevChapterId?: string;
}

export const generateChapters = async ({
    amount,
    chapters,
    nested,
    nameWords,
    paragraphs,
    bookId,
    prevChapterId,
    prisma
}: GenerateChaptersParams): Promise<GenerateChaptersOutput> => {
    const chapterTypes: Array<ChapterType>  = ["Default", "Directory"];
    const type = nested.level.current >= nested.level.max ? "Default" : pick(chapterTypes) as ChapterType;

    const top = nested.level.current > 0 ? { top: { connect: { id: nested.topChapterId } } } : {};
    let prev = () => 
        type == "Default"
        ? prevChapterId != null
            ? { prev: { connect: { id: prevChapterId } } } 
            : {}
        : {};

    const chapterIDs: Array<string> = [];
    for (let i = 0; i <= amount; i++) {

        console.log(`Creating chapter [${nested.level.current}:${nested.level.max}] ${i}/${amount}...`);

        const { id } = await prisma.chapter.create({
            data: {
                name: generateWords(nameWords),
                type,
                ...top,
                ...prev(),
                book: { 
                    connect: { 
                        id: bookId 
                    } 
                } 
            }
        });

        if (type == "Directory") {
            prevChapterId = (await generateChapters({
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
                prevChapterId,
                prisma
            })).prevChapterId;
        } else {
            await generateParagraphs({
                chapterId: id,
                amount: random(paragraphs.min, paragraphs.max),
                prisma
            });
            prevChapterId = id;
        }

        chapterIDs.push(id);
    }

    return {
        chapterIDs, 
        prevChapterId
    };
};
