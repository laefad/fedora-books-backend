import { ResolverActionsConfig, UserRole } from '@/generated';
import { Authorized } from 'type-graphql';

export const AuthorActionsMap: ResolverActionsConfig<'Author'> = {
    createAuthor: [Authorized(UserRole.Moderator, UserRole.Admin)],
    createManyAuthor: [Authorized(UserRole.Admin)],
    deleteAuthor: [Authorized(UserRole.Moderator, UserRole.Admin)],
    deleteManyAuthor: [Authorized(UserRole.Admin)],
    updateAuthor: [Authorized(UserRole.Moderator, UserRole.Admin)],
    updateManyAuthor: [Authorized(UserRole.Admin)],
    upsertAuthor: [Authorized(UserRole.Moderator, UserRole.Admin)],
};
