// Helpers
import jwt from "jsonwebtoken"
export const generateToken = (user: { id: number; email: string; }) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  };
