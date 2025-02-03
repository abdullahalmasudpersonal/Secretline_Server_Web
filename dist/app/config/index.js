"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
exports.default = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        accessToken: process.env.JWT_ACCESS_TOKEN,
        accessTokenExpriesin: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refreshtoken: process.env.JWT_REFRESH_TOKEN,
        refreshtokenexpiresin: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
};
