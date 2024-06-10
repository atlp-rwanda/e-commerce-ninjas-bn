/* eslint-disable @typescript-eslint/no-explicit-any */
import Users from "../../../databases/models/users";

const getAllUsers = async () => {
  return Users.findAll();
};

const updateUserProfile = async (user: any, id: string) => {
  await Users.update({ ...user }, { where: { id }, returning: true });
  const updateUser = await Users.findOne({ where: { id } });
  return updateUser;
};

export default { getAllUsers, updateUserProfile };
