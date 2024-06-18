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

const postChatMessage = async (userId, message) => {
  const chat = await db.Chats.create({ userId, message });
  const fullChat = await db.Chats.findOne({
    where: { id: chat.id },
    include: [
      {
        model: db.Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "role"]
      }
    ]
  });

  return fullChat.toJSON();
};



const getAllPastChats = async () => {
  const chats = await db.Chats.findAll({
    limit: 50,
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: db.Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "role"]
      }
    ]
  });
  return chats;
};


export default { getAllUsers, updateUserProfile, postChatMessage, getAllPastChats };
