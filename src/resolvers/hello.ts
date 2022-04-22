import { Hello } from "@/types/hello";
import { Query, Resolver } from "type-graphql";

@Resolver(of => Hello)
export class HelloResolver {
    private hello: Hello = Hello.create({
        message: "Hello, user"
    });

    @Query(returns => Hello, { nullable: false })
    public async getHello(): Promise<Hello> {
        return await this.hello;
    }
}
