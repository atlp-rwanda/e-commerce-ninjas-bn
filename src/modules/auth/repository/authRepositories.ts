/* eslint-disable @typescript-eslint/no-explicit-any */
import Users from "../../../databases/models/users"

const registerUser = async (body:any) =>{
    return await Users.create(body)
}

const findUserByEmail = async (email:string) =>{
    return await Users.findOne({ where: { email: email} })
}


export default {registerUser, findUserByEmail}