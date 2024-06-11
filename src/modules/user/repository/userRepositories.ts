/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "../../../databases/models";
const { Users, Chats } = db

const getAllUsers = async () => {
  return Users.findAll();
};

const updateUserProfile = async (user: any, id: string) => {
  await Users.update({ ...user }, { where: { id }, returning: true });
  const updateUser = await Users.findOne({ where: { id } });
  return updateUser;
};

const getAllChats = async () => {
  const chats = await Chats.findAll({
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email"]
      }
    ]
  });
  return chats;
}

const postChatMessage = async (userId: string, message: any) => {
 const chat = await Chats.create({ userId, message });
  return await Chats.findOne({
    where: { id: chat.id },
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email"]
      }
    ]
  });
}
export default { getAllUsers, updateUserProfile, getAllChats, postChatMessage };
