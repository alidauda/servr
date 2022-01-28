"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entites/User");
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
let InputField = class InputField {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], InputField.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], InputField.prototype, "password", void 0);
InputField = __decorate([
    (0, type_graphql_1.InputType)()
], InputField);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async register(options, { em, req }) {
        if (!options.email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/)) {
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
        const hashedPassword = await bcrypt_1.default.hash(options.password, 10);
        const user = em.create(User_1.User, {
            email: options.email,
            password: hashedPassword,
        });
        try {
            await em.persistAndFlush(user);
        }
        catch (err) {
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
        req.session.userId = user.id;
        return { user };
    }
    async login(options, { em, req }) {
        const user = await em.findOne(User_1.User, { email: options.email });
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
        const valid = await bcrypt_1.default.compare(options.password, user.password);
        console.log(valid);
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
        req.session.userId = user.id;
        return { user };
    }
    me() {
        return "hello";
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InputField,
        types_1.MyContext]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InputField, types_1.MyContext]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map