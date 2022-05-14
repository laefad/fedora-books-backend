import { Resolver, Ctx, Mutation, Arg, Query, Info } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';
import { User } from '@/generated'
import { transformCountFieldIntoSelectRelationsCount, transformFields } from '@/generated/helpers';
import { Context } from '@/types';
import { UserLoginInput } from '@/models'
import { generateToken, getUser } from '@/utils';

@Resolver(_of => User)
export class UserLoginResolver {
    @Mutation(_returns => String)
    async login(
        @Ctx() { prisma }: Context,
        @Info() info: GraphQLResolveInfo,
        @Arg('data') args: UserLoginInput
    ): Promise<string | null> {
        const token = generateToken(prisma, args);
        return token;
    }

    @Query(_returns => User, {
        nullable: true
    })
    async getCurrentUser(
        @Ctx() { prisma, token }: Context,
        @Info() info: GraphQLResolveInfo
    ): Promise<User | null> {
        try {
            const { id } = getUser(token);
            const { _count } = transformFields(
                graphqlFields(info as any)
            );
            return prisma.user.findUnique({
                where: {
                    id: id
                },
                ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
            });
        } catch {
            return null;
        }
    }
}
