import { Request } from "express";
import { UsersAttributes } from "../databases/models/users";

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
  userId?: number,
  user?: UsersAttributes
}

export interface IProductSold {
  id: number;
  name: string;
  quantity: number;
}

export interface ExtendRequest extends Request {
  files: Express.Multer.File[];
  user?: user;
  shop?:Shops;
}

export interface IProduct {
  id: number;
  collectionId: number;
  shopId: number;
  name: string;
  description?: string;
  price: number;
  discount?: string;
  category: string;
  expiryDate?: Date;
  expired: boolean;
  bonus?: string;
  images: string[];
  quantity: number;
  isAvailable: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICollection {
  id: number;
  shopId: number;
  name: string;
  description?: string;
}
export interface userInfo {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accToken: string;
}