/* eslint-disable @typescript-eslint/no-explicit-any */

import db from "../../../databases/models";

const getAllUsers = async () => {
  return db.Users.findAll();
};

const updateUserProfile = async (user: any, id: string) => {
  await db.Users.update({ ...user }, { where: { id }, returning: true });
  const updateUser = await db.Users.findOne({ where: { id } });
  return updateUser;
};

export default { getAllUsers, updateUserProfile };
