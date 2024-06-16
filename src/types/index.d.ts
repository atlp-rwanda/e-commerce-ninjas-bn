// eslint-disable @typescript-eslint/no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  searchQuery?: any;
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

export interface IExtendedCartProduct extends CartProductAttributes{
  products?: IProduct;
}