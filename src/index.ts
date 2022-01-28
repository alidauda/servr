import { MikroORM } from "@mikro-orm/core";
import "reflect-metadata";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import rateLimit from "express-rate-limit";
import RateLimitRedis from "rate-limit-redis";
import cors from "cors";

import { cookies, __prod__, __secret__ } from "./constant";
const main = async () => {
  const orm = await MikroORM.init(microConfig);

  await orm.getMigrator().up();

  const app = express();
  const redis = new Redis();
  let RedisStore = connectRedis(session);
  app.use(
    cors({
      origin: "https://studio.apollographql.com",
      credentials: true,
    })
  );
  
 
  app.use(
    session({
      name: cookies,
      store: new RedisStore({ client: redis, disableTouch: true }),
      saveUninitialized: false,
      secret: __secret__,
      resave: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
    })
  );

  
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });
  await server.start();
  server.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("toh fh");
  });
};
main().catch((err) => {
  console.log(err);
});
