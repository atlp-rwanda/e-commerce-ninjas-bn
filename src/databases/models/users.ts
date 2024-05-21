import { Model, DataTypes, Sequelize } from 'sequelize';

interface UsersAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone:number;
    role: string;
    isVerified: boolean;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

module.exports = (sequelize: Sequelize) => {
    class Users extends Model<UsersAttributes> implements UsersAttributes {
        declare id: number;
        declare firstName: string;
        declare lastName: string;
        declare email: string;
        declare phone:number;
        declare role: string;
        declare isVerified: boolean;
        declare status: boolean;
        declare password: string;
        declare createdAt: Date;
        declare updatedAt: Date;

        // Define any static methods or associations here

    }

    Users.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            lastName: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            password: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            phone: {
                type: new DataTypes.BIGINT,
                allowNull: false,
            },
            role: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            isVerified: {
                type: new DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            status: {
                type: new DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                field: 'createdAt',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                field: 'updatedAt',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            tableName: 'users',
            timestamps: true,
            modelName:'Users',
        }
    );

    return Users;
};
