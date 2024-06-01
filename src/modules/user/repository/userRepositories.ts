import Users from "../../../databases/models/users";


const getAllUsers = async () => {
    return Users.findAll();
}

const getUserById = async (id: number) => {
    return Users.findByPk(id);
}

export default { getAllUsers, getUserById}