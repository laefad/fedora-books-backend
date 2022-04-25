import { PrismaClient } from "@prisma/client";

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

  // USERS

  const user1 = await prisma.user.create({
    data: {
      name: "Alice",
      password: "alicepassword"
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Bob",
      password: "bobpassword"
    },
  });

  // TAGS

  const tag1 = await prisma.tag.create({
    data: {
      name: "Fantasy",
    }
  });

  const tag2 = await prisma.tag.create({
    data: {
      name: "Drama",
    }
  });

  // USERTAGS

  const user1Tag1 = await prisma.userTag.create({
    data: {
      name: "Favorite",
      user: {
        connect: {
          id: user1.id
        }
      }
    }
  });

  const user2Tag1 = await prisma.userTag.create({
    data: {
      name: "Best",
      user: {
        connect: {
          id: user2.id
        }
      }
    }
  });

  // AUTHORS 

  const author1 = await prisma.author.create({
    data: {
      name: "Writer",
    }
  })

  // BOOKS 

  const book1 = await prisma.book.create({
    data: {
      name: "Book 1",
      publishedAt: new Date(),
      tags: {
        connect: [
          {
            id: tag1.id
          },
          {
            id: tag2.id
          }
        ]
      },
      authors: {
        connect: [
          {
            id: author1.id
          }
        ]
      },
      content: {createMany: {
        data: [
          {
            type: "Heading",
            content: "The first chapter"
          },
          {
            type: "Text",
            content: "The first paragraph"
          }, 
          {
            type: "Text",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae metus accumsan, posuere odio pellentesque, ultrices ligula. Mauris a commodo neque, id sagittis metus. Proin euismod scelerisque leo, interdum vehicula tellus ultrices eu. Pellentesque ornare tortor et maximus aliquet. Ut maximus ullamcorper aliquet. Mauris ac enim neque. Integer interdum, justo eu posuere venenatis, massa turpis molestie urna, sodales ullamcorper mauris nibh non libero. Duis dapibus egestas semper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
          },
          {
            type: "Text",
            content: "In in condimentum purus. In euismod, nibh sed iaculis sodales, justo ipsum laoreet lacus, sit amet sollicitudin ligula elit at est. Praesent in justo gravida, tincidunt urna vitae, tempus ex. Etiam id turpis sagittis, sagittis dolor sit amet, consequat diam. Nulla facilisi. Proin ac dignissim nulla. Aenean efficitur et diam ullamcorper faucibus. Pellentesque massa odio, vestibulum vel neque at, accumsan egestas mi. Nullam diam tellus, laoreet sit amet diam nec, rhoncus volutpat quam. Curabitur quis nisi non massa porta scelerisque. Maecenas tempor scelerisque risus, sit amet iaculis metus pharetra a. Nulla aliquet auctor orci quis pellentesque. Nulla fringilla, arcu et gravida gravida, ante eros mollis lorem, vitae pulvinar augue orci sed dui. Mauris enim diam, dictum faucibus consequat at, varius vel diam."
          },
          {
            type: "Heading",
            content: "Chapter 2"
          },
          {
            type: "Text",
            content: "Donec convallis arcu vel velit eleifend, id tristique turpis suscipit. Maecenas tempor ultricies urna, non porta lacus. Donec libero mi, dapibus accumsan velit sit amet, dignissim euismod nisl. Vivamus venenatis vitae lectus eget tincidunt. Maecenas ut felis ut augue iaculis ornare vitae tincidunt massa. Aenean posuere nec nunc quis suscipit. Aliquam imperdiet iaculis risus pellentesque mollis. Morbi id elit dapibus, pharetra nisl at, pellentesque ligula. Praesent lectus metus, tincidunt at magna eget, imperdiet viverra purus. Pellentesque viverra magna non nulla ultrices, eget efficitur lorem luctus. Maecenas felis libero, consectetur vel est at, mattis porttitor nisl. Ut condimentum magna eu eros ornare, ac sollicitudin nunc aliquet. Maecenas euismod faucibus massa. Nunc quis velit ut risus mattis porttitor. Duis tortor est, aliquet ut augue ut, posuere iaculis justo. Phasellus aliquam vel dolor quis ultrices."
          }
        ]
      }}
    }
  });

  // ADD BOOKS TO USER TAGS
  // work only in 1 side

  await prisma.userTag.update({
    data: {
      books: {
        connect: [
          {
            id: book1.id
          }
        ]
      }
    },
    where: {
      id: user1Tag1.id
    },
  });

  await prisma.userTag.update({
    data: {
      books: {
        connect: [
          {
            id: book1.id
          }
        ]
      }
    }, 
    where: {
      id: user2Tag1.id
    }
  });

  // USER BOOK LISTS 

  const user1list1 = await prisma.bookList.create({
    data: {
      name: "My books",
      user: {
        connect: {
          id: user1.id
        }
      },
      books: {
        connect: [
          {
            id: book1.id
          }
        ]
      }
    }
  });

  const user2list1 = await prisma.bookList.create({
    data: {
      name: "Bob books",
      user: {
        connect: {
          id: user2.id
        }
      },
      books: {
        connect: [
          {
            id: book1.id
          }
        ]
      }
    }
  });

  console.log("seeding completed");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
