import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Hello {
    public static create (
        data: Partial<Hello>
    ): Hello {
        return Object.assign(new Hello(), data);
    }

    @Field()
    public message!: string;
}
