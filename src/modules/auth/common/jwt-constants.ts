import * as dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET, PAGODA_BEARER, GITHUB_UPDATE_CONTRACTS_SECRET } =
  process.env;

export const jwtConstants = {
  secret: JWT_SECRET,
  pagodaBearer: PAGODA_BEARER,
  githubBearer: GITHUB_UPDATE_CONTRACTS_SECRET,
};
