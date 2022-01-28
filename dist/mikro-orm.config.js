"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const constant_1 = require("./constant");
const User_1 = require("./entites/User");
exports.default = {
    entities: [User_1.User],
    dbName: 'myshop',
    type: 'postgresql',
    debug: !constant_1.__prod__,
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
};
//# sourceMappingURL=mikro-orm.config.js.map