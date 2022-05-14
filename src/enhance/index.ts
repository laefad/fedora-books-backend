import { AuthorActionsMap } from '@/enhance/author'; 
import { ResolversEnhanceMap, applyResolversEnhanceMap } from '@/generated';

export const enhance = () => {
    const resolversEnhanceMap: ResolversEnhanceMap = {
        Author: AuthorActionsMap,
    };

    applyResolversEnhanceMap(resolversEnhanceMap);
}
