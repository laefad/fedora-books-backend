// Required for type-graphql
import 'reflect-metadata';

import { PrismaClient } from '@prisma/client';
import { 
  generateAuthors, 
  generateBooks,
  generateTags,
  generateUsers,
  generateBookLists,
  generateUserTags
} from '@/generators';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  await prisma.tag.deleteMany({});
  await prisma.userTag.deleteMany({});
  await prisma.paragraph.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.bookList.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.book.deleteMany({});

  // TAGS 

  const tagIDs = await generateTags({
    amount: 20,
    length: { min: 5, max: 10 },
    prisma
  });

  // USERS

  const userIDs = await generateUsers({
    amount: 5,
    length: {
      name: { min: 5, max: 10 },
      password: { min: 5, max: 10 }
    },
    prisma
  });

  // USERTAGS

  const userTagIDs = await generateUserTags({
    amount: 18, 
    length: { min: 5, max: 10 },
    userIDs,
    prisma
  });

  // AUTHORS 

  const authorIDs = await generateAuthors({
    amount: 6, 
    length: { min: 5, max: 10 },
    prisma
  })

  // BOOKS 

  const bookIDs = await generateBooks({
    booksAmount: 40,
    bookNameWords: {
      amount: {
        min: 1,
        max: 4
      },
      length: {
        min: 4,
        max: 10
      }
    },
    paragraphs: {
      amount: {
        min: 3,
        max: 20
      },
      nameWords: {
        amount: {
          min: 1,
          max: 10
        },
        length: {
          min: 1,
          max: 14
        }
      },
    },
    chapters: {
      max: 5,
      min: 1
    },
    maxNested: 2,
    tagIDs,
    userTagIDs,
    authorIDs,
    prisma
  });

  // USER BOOK LISTS 

  const bookListIDs = generateBookLists({
    amount: 5, 
    nameWords: {
      amount: {
        min: 2,
        max: 4
      },
      length: {
        min: 2,
        max: 12
      }
    },
    userIDs,
    bookIDs,
    prisma
  });

  console.log("seeding completed");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
