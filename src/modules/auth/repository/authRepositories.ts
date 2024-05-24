import { IToken } from "../../../../types";
import db  from "../../../databases/models"

const { Users, Tokens } = db;

const findUserByEmail = async (email: string) => {
    return await Users.findAll({
        where: { email }
    });
}

const addToken = async (body: IToken) =>{
    return await Tokens.create(body);
}

export {
    findUserByEmail,
    addToken
}