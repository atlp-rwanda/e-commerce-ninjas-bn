import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const generateToken = (userId: string) => {
    const token = jwt.sign({userId}, process.env.JWT_KEY, {expiresIn: "1d"});
    return token;
}
// const encryptPassword = async (password: string) =>{
//     return await bcrypt.hash(password, 10);
// }

const comparePassword = async (password: string, hashedPassword: string) =>{
    return await bcrypt.compare(password, hashedPassword);
}

export {
    comparePassword,
    generateToken
}