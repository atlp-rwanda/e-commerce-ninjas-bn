import db  from '../../../databases/models'

const { Users } = db;

const findUserByEmail = async (email: string) => {
    return await Users.findAll({
        where: { email }
    });
}
const getAllUsers = async () => {
    return await Users.findAll();
}

export {
    findUserByEmail,
    getAllUsers
}