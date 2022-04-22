import { ClassType, InputType, ObjectType } from "type-graphql";

export default function withId<TClassType extends ClassType>(BaseClass: TClassType) {

    @ObjectType({isAbstract: true})
    @InputType({isAbstract: true})
    class CreateTrait extends BaseClass {
        public static create (
            data: Partial<TClassType>
        ): CreateTrait {
            return Object.assign(new BaseClass(), data);
        }
    }

    return CreateTrait;
}
