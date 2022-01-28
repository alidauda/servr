import { User } from "../entites/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import bcrypt from "bcrypt";
@InputType()
class InputField {
  @Field()
  email: string;
  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: InputField,
    @Ctx() { em ,req}: MyContext
  ): Promise<UserResponse> {
    if (
      !options.email.match(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
      )
    ) {
      return {
        error: [
          {
            field: "email",
            message: "invalide email",
          },
        ],
      };
    }

    if (options.password.length <= 7) {
      return {
        error: [
          {
            field: "password",
            message: "password must be at least 8 characters",
          },
        ],
      };
    }
    const hashedPassword = await bcrypt.hash(options.password, 10);
    const user = em.create(User, {
      email: options.email,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          error: [
            {
              field: "email",
              message: "email already exist",
            },
          ],
        };
      }
    }
    req.session.userId=user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(@Arg("options") options: InputField, @Ctx() { em,req }: MyContext):Promise<UserResponse> {
    const user = await em.findOne(User, { email: options.email });
    if (!user) {
      return {
        error: [
          {
            field: "email",
            message: "this user does not exist",
          },
        ],
      };
    }
    const valid = await bcrypt.compare(options.password,user.password);
    console.log(valid)
    if (!valid) {
      return {
        error: [
          {
            field: "password",
            message: "that password is inncorect ",
          },
        ],
      };
    }
    req.session.userId=user.id;
    return { user };
  }
  @Query(() => User)
  me() {
    return "hello";
  }
}
