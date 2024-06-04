import { Request } from "express";

export interface IToken{
    userId: number;
    device: string;
    accessToken: string;
}

export interface ILogin{
    email: string;
    password: string;
}

export interface IRequest extends Request{
    loginUserId?: number;
    token;
    userId?: number
}

export interface IProductSold {
    product: string;
    quantity: number;
  }

  
export interface IProduct{
    id: number;
    collectionId: number;
    sellerId: number;
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

export interface ICollection{
    id: number;
    sellerId: number;
    name: string;
    description?: string;
}