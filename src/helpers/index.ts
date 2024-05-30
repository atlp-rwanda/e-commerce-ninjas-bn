import jwt,{JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config

 const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  };

  const decodeToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    ;
  };

  const comparePassword = async (password: string, hashedPassword: string) =>{
    return await bcrypt.compare(password, hashedPassword);
}

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};


export const hashPassword = async (password: string): Promise<string> => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
};




  export { generateToken, verifyToken, decodeToken, comparePassword }

