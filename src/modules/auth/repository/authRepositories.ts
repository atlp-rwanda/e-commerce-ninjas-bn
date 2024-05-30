/* eslint-disable @typescript-eslint/no-explicit-any */
import Users from "../../../databases/models/users"
import Session from "../../../databases/models/session"

const createUser = async (body:any) =>{
    return await Users.create(body)
}


const findUserByAttributes = async (key:string, value:any) =>{
    return await Users.findOne({ where: { [key]: value} })
}

const updateUserByAttributes = async (updatedKey:string, updatedValue:any, whereKey:string, whereValue:any) =>{
    await Users.update({ [updatedKey]: updatedValue }, { where: { [whereKey]: whereValue} });
    return await findUserByAttributes(whereKey, whereValue)
}

const createSession = async (body: any) => {
    return await Session.create(body);
}

const findSessionByUserId = async( userId:number ) => {
    return await Session.findOne({ where: { userId } });
}

const destroySession = async (userId: number, token:string) =>{
    return await Session.destroy({ where: {userId, token } });
}

export default { createUser, createSession, findUserByAttributes, destroySession, updateUserByAttributes, findSessionByUserId }