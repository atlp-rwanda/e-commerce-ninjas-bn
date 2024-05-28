/* eslint-disable @typescript-eslint/no-explicit-any */
import Users from "../../../databases/models/users"
import Tokens from "../../../databases/models/tokens"
import { IToken } from "../../../types"

const registerUser = async (body:any) =>{
    return await Users.create(body)
}

const findUserByEmail = async (email:string) =>{
    return await Users.findOne({ where: { email: email} })
}

const addToken = async (body: IToken) =>{
    return await Tokens.create(body);
}


export default { registerUser, findUserByEmail, addToken }