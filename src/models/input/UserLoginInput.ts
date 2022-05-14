import { Field, InputType } from 'type-graphql';

@InputType('UserLoginInput', {
    isAbstract: true
})
export class UserLoginInput {

    @Field(_type => String, {
        nullable: false
    })
    name!: string;

    @Field(_type => String, {
        nullable: false
    })
    password!: string;

}
