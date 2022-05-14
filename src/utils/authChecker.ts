import type { Context } from '@/types';
import { AuthChecker } from 'type-graphql';
import { getUser } from '@/utils';

export const customAuthChecker: AuthChecker<Context> = (
    { root, args, context, info },
    roles,
) => {
    const user = getUser(context.token);
    return roles.some(role => role == user.role);
};
