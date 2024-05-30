/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { UsersAttributes } from "../databases/models/users";
import authRepository from "../modules/auth/repository/authRepositories";
import httpStatus from "http-status";
import { decodeToken } from "../helpers";
import Session from "../databases/models/session";

interface ExtendedRequest extends Request {
  user: UsersAttributes;
  session: Session;
}

export const userAuthorization = function (roles: string[]) {
  return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      let token: string;
      if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ").at(-1);
      }

      if (!token) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ status: httpStatus.UNAUTHORIZED, message: "Not authorized" });
      }

      const decoded: any = await decodeToken(token);

      const session: Session = await authRepository.findSessionByUserIdAndToken(
        decoded.id, token
      );
      if (!session) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ status: httpStatus.UNAUTHORIZED, message: "Not authorized" });
      }

      const user = await authRepository.findUserByAttributes("id", decoded.id);

      if (!user) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ status: httpStatus.UNAUTHORIZED, message: "Not authorized" });
      }

      if (!roles.includes(user.role)) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ status: httpStatus.UNAUTHORIZED, message: "Not authorized" });
      }

      req.user = user;
      req.session = session;
      next();
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  };
};
