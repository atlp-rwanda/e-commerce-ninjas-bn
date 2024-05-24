/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "../../../databases/models/index"
const {Users} = db

const registerUser = async (body:any) =>{
    return await Users.create(body)
}

const findUserByEmail = async (email:string) =>{
    return await Users.findOne({ where: { email: email} })
}

const findUserById = async (userId: number) => {
    return await Users.findOne({ where: { id: userId } });
};

const updateUserPassword = async (userId: number, newPassword: string) => {
    return await Users.update({ password: newPassword }, { where: { id: userId } });
};

const updateUserLastPasswordChange = async (userId: number, lastPasswordChange: Date): Promise<void> => {
    await Users.update({ lastPasswordChange: lastPasswordChange }, { where: { id: userId } });
};


const findUserByResetToken = async (resetPasswordToken: string) => {
    return await Users.findOne({ where: { resetPasswordToken: resetPasswordToken } });
};

const updateUser = async (id: number, updateFields: any) => {
    return await Users.update(updateFields, { where: { id: id } });
};



export default {registerUser, findUserByEmail, findUserById, updateUserPassword, updateUserLastPasswordChange , findUserByResetToken, updateUser }