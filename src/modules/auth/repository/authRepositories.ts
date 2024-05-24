import { Op, where } from "sequelize";
import db from "../../../databases/models";

export const invalidateToken = async(token:string)=>{
    const accessToken = db;

    await accessToken.update({
        isValid: false
    }, {
        where:{
            token:{
                [Op.eq]:token
            }
        }
    });
    return true;
}

