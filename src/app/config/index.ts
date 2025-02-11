import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
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
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};
