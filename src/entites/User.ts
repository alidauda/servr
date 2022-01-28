import { Property, PrimaryKey, Entity } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  password!: string;

  @Field(() => String)
  @Property({ type: "date", nullable: true })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date(), nullable: true })
  updatedAt = new Date();
}
