// Required for type-graphql
import 'reflect-metadata';

import { ApolloServer, CorsOptions } from 'apollo-server';
import { PrismaClient } from "@prisma/client";
import { buildSchema } from 'type-graphql';

// import { HelloResolver } from '@/resolvers/hello';
import { resolvers } from "@/generated";

interface Context {
    prisma: PrismaClient;
}

async function bootstrap() {
    const schema = await buildSchema({
        // resolvers: [HelloResolver],
        resolvers,
        validate: false,
    });

    const freeCors: CorsOptions = {
        allowedHeaders: '*',
        methods: 'GET, POST',
        origin: '*',
    };

    const prisma = new PrismaClient();
    await prisma.$connect();

    const server = new ApolloServer({ 
        schema,
        cors: freeCors,
        context: (): Context => ({ prisma }),
    });
    
    const { url } = await server.listen(3000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
}
  
bootstrap();
