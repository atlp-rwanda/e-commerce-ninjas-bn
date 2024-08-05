// eslint-disable @typescript-eslint/no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { CartProductAttributes } from "../databases/models/cartProducts";
import { CartAttributes } from "../databases/models/carts";

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
  product?: any;
  cart?: any;
  carts?: any;
  files: Express.Multer.File[];
  user?: user;
  shop?: Shops;
  cart?:Cart;
  orders?:any;
  wishList?:any;
  wishListId:string;
  pagination?: {
    limit: number;
    page: number;
    offset: number;
  };
  searchQuery?: any;
  order?: any;
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
  id: string;
  userId: string;
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
    role: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
export interface IExtendedCartProduct extends CartProductAttributes {
  products?: IProduct;
  carts?: CartAttributes;
}

export interface CustomSocket extends Socket {
  user: UserAttributes;
}

export interface JwtPayload extends usersAttributes {
  iat?: number;
  exp?: number;
}

export interface INotifications {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
}

export interface IProductsWithShop extends IProduct {
  shops?: IShops;
}
export interface SellerRequestAttribute {
  id: string;
  userId: string;
  requestStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderWithCart extends OrderAttributes {
  carts?: CartAttributes;
}