// user repositories
import db from '../../../databases/models/index'
const {Users} = db

const registerUser = async (body:any) =>{
    const user = await Users.create(body)
    return user;
}

const getUserByEmail = async (email:string) =>{
    const user = await Users.findOne({ where: { email: email} })
    return user;
}

export default {registerUser, getUserByEmail}