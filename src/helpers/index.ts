import jwt,{JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config

 const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  };

  const decodeToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    ;
  };

  export { generateToken, decodeToken}