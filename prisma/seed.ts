import { PrismaClient } from "@prisma/client";
import { generateAuthors } from "./seed/author";
import { generateBooks } from "./seed/book";
import { generateTags } from "./seed/tag";
import { generateUsers } from "./seed/user";
import { generateBookLists } from "./seed/userBookList";
import { generateUserTags } from "./seed/userTag";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  await prisma.tag.deleteMany({});
  await prisma.text.deleteMany({});
  await prisma.userTag.deleteMany({});
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
    paragraphs: {
      max: 10,
      min: 4
    },
    chapters: {
      max: 10,
      min: 1
    },
    tagIDs,
    userTagIDs,
    authorIDs,
    prisma
  });

  // TODO check
  // ADD BOOKS TO USER TAGS
  // work only in 1 side

  // await prisma.userTag.update({
  //   data: {
  //     books: {
  //       connect: [
  //         {
  //           id: book1.id
  //         }
  //       ]
  //     }
  //   },
  //   where: {
  //     id: user1Tag1.id
  //   },
  // });

  // USER BOOK LISTS 

  const bookListIDs = generateBookLists({
    amount: 5, 
    length: { min: 5, max: 10 },
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
