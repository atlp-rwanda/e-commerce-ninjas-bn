import { Request } from "express";
import { CartProductAttributes } from "../databases/models/cartProducts";

export interface IToken {
  userId: number;
  device: string;
  accessToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ExtendRequest extends Request {
  files: Express.Multer.File[];
  user?: user;
  shop?: Shops;
  pagination?: {
    limit: number;
    page: number;
    offset: number;
  };
}

export interface IProduct {
  id: string;
  shopId: string;
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
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductSold {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

export interface IShops {
  id: number;
  userId: number;
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

export interface chatsAttributes {
  id: string;
  userId?: string;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface chatsAttributes {
  id: number;
  userId: string;
  message: string;
  createdAt: Date;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
export interface IExtendedCartProduct extends CartProductAttributes{
  products?: IProduct;
}

export interface CustomSocket extends Socket {
  user: UserAttributes
}

export interface JwtPayload extends usersAttributes {
  iat?: number
  exp?: number
}