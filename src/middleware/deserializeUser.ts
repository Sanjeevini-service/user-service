import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import logger from "../utils/logger";
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`${req.method}:${req.originalUrl}`);
    const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");

    if (!accessToken) {
      return next();
    }

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

    // console.log("decoded==========", decoded);

    if (decoded) {
      res.locals.user = decoded;
    }

    return next();
  } catch (error) {
    return next();
  }
};

export default deserializeUser;
