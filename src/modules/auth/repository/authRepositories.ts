/* eslint-disable @typescript-eslint/no-explicit-any */
import Users from "../../../databases/models/users"
import Tokens from "../../../databases/models/tokens"
import { IToken } from "../../../types"
import crypto from "crypto"
const registerUser = async (body:any) =>{
    return await Users.create(body)
}

const findUserByEmail = async (email:string) =>{
    return await Users.findOne({ where: { email: email} })
}

const findUserById = async (id:string) =>{
    return await Users.findOne({ where: { id: id} })
}

const createToken = async (body: any) => {
    return await Tokens.create({ userId: body,verifyToken:crypto.randomBytes(32).toString("hex")  });
}

const verifyUserToken = async (id:string,token: string) => {
    return await Tokens.findOne({ where: { userId: id ,verifyToken: token } });
}

const addToken = async (body: IToken) =>{
    return await Tokens.create(body);
}

const tokenRemove = async (token:string) =>{
    return await Tokens.destroy({ where: {verifyToken: token}});
}

const UpdateUserVerified = async (id:string) =>{
    return await Users.update({ isVerified: true }, { where: { id: id } });
}

export default {registerUser, findUserByEmail, createToken,addToken,findUserById,verifyUserToken,tokenRemove,UpdateUserVerified}