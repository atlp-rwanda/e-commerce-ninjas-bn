/* eslint-disable @typescript-eslint/no-explicit-any */
import Users from "../../../databases/models/users"

const findUserByAttributes = async (key:string, value:any) =>{
    return await Users.findOne({ where: { [key]: value} })
}

const UpdateUserByAttributes = async (updatedKey:string, updatedValue:any, whereKey:string, whereValue:any) =>{
    await Users.update({ [updatedKey]: updatedValue }, { where: { [whereKey]: whereValue} });
    return await findUserByAttributes(whereKey, whereValue)
}

export default {findUserByAttributes, UpdateUserByAttributes }