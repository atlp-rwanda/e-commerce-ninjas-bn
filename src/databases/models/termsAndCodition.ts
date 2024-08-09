/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";


export interface ITermsAndConditions {
    id: string;
    content:string;
    type: string;
}
class TermsAndConditions extends Model<ITermsAndConditions> implements ITermsAndConditions {
    declare id: string;
    declare content: string;
    declare type: string;     

    static associate() {

      }    
}

TermsAndConditions.init(
    {
        id: {
            type: DataTypes.UUID,
            autoIncrement: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        content: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: "termsAndConditions",
        modelName: "TermsAndConditions",
    }
);

export default TermsAndConditions;