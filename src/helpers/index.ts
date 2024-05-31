import jwt,{JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config

 const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
  };

  const decodeToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    ;
  };

  const comparePassword = async (password: string, hashedPassword: string) =>{
    return await bcrypt.compare(password, hashedPassword);
}

  export { generateToken, decodeToken, comparePassword }