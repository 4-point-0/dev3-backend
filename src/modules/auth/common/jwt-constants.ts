import * as dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET, PAGODA_BEARER } = process.env;

export const jwtConstants = {
  secret: JWT_SECRET,
  pagodaBearer: PAGODA_BEARER,
};
