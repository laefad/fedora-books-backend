// Required for type-graphql
import 'reflect-metadata';

import { ApolloServer, CorsOptions } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';

import type { Context } from '@/types';
import { UserLoginResolver } from '@/resolvers';
import { enhance } from '@/enhance';
import { customAuthChecker } from '@/utils';
import { resolvers } from '@/generated';
import { env } from 'process';

async function bootstrap() {

    enhance();

    const schema = await buildSchema({
        resolvers: [...resolvers, UserLoginResolver],
        validate: false,
        authChecker: customAuthChecker,
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
        context: ({req}): Context => ({ 
            prisma,
            token: req.headers?.authorization?.split(' ')[1] ?? ''
        }),
    });

    const port = env.PORT ?? 3000;

    const { url } = await server.listen(port);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
