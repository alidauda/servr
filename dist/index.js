"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
require("reflect-metadata");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const ioredis_1 = __importDefault(require("ioredis"));
const cors_1 = __importDefault(require("cors"));
const constant_1 = require("./constant");
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const app = (0, express_1.default)();
    const redis = new ioredis_1.default();
    let RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    app.use((0, cors_1.default)({
        origin: "https://studio.apollographql.com",
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constant_1.cookies,
        store: new RedisStore({ client: redis, disableTouch: true }),
        saveUninitialized: false,
        secret: constant_1.__secret__,
        resave: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: 'lax',
            secure: constant_1.__prod__
        },
    }));
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [user_1.UserResolver],
    });
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({ em: orm.em, req, res, redis })
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
//# sourceMappingURL=index.js.map