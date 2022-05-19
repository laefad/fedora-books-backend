// This is a workaround for unique indexes in prisma that don't support sparse option
import { MongoClient } from 'mongodb';
import { env, exit } from 'process';

// Connection URL
const url = env.DATABASE_URL;
if (url == undefined) {
    console.log("DATABASE_URL env doesn't set, fixIndex failed.");
    exit(1);
}

const client = new MongoClient(url);

async function main() {
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db();

    await db.collection('Chapter')
        .dropIndex('Chapter_prevId_key');

    console.log('Chapter_prevId_key index deleted');

    await db.collection('Chapter')
        .createIndex({
            'prevId': 1
        }, {
            name: 'Chapter_prevId_key',
            sparse: true,
            unique: true
        });
    console.log('new Chapter_prevId_key index created');

  return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
