import Users from "../../../databases/models/users";


const getAllUsers = async () => {
    return Users.findAll();
}

export default { getAllUsers}