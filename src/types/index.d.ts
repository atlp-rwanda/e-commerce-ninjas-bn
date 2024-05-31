import { Request } from "express";

export interface IToken {
  userId: number;
  device: string;
  accessToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRequest extends Request {
  loginUserId?: number;
  token;
}
