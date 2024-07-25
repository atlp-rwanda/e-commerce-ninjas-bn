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

const addNotification = async (userId: string, message: string) => {
  return await db.Notifications.create({ userId, message });
}

const findNotificationsByuserId = async (userId: string) => {
  return await db.Notifications.findAll({ where: { userId } });
}

const findNotificationById = async (userId: string, id: string) => {
  return await db.Notifications.findOne({ where: { userId, id } });
}

const markNotificationAsRead = async (key: string, value: any) => {
  await db.Notifications.update({ isRead: true },{ where: { [key]: value } });
  return await db.Notifications.findOne({ where: { [key]: value } })
};

const markAllNotificationsAsRead = async (userId: string) => {
  await db.Notifications.update({ isRead: true },{ where: { userId, isRead: false } });
  return await db.Notifications.findAll({where: { userId } })
};

const findUserById = async (id: string) => {
  return await db.Users.findOne({ where: { id } });
};

const createSellerRequest = async (request: { userId: string; requestStatus: string }) => {
  return await db.SellerRequest.create(request);
};

const findSellerRequestByUserId = async (userId: string) => {
  return await db.SellerRequest.findOne({ where: { userId } });
};

const updateUserAddress = async (address: any, userId: string) => {
  await db.Addresses.update({ ...address }, { where: { userId }, returning: true });
  const updateAddress = await db.Addresses.findOne({ where: { userId } });
  return updateAddress;
};

const addUserAddress = async (address: any) => {
  return await db.Addresses.create(address);
};

const findAddressByUserId = async (userId: string) => {
  return await db.Addresses.findOne({ where: { userId } });
};

export default { 
  getAllUsers, 
  updateUserProfile, 
  postChatMessage, 
  getAllPastChats,
  addNotification,
  findNotificationsByuserId,
  findNotificationById,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  findUserById,
  createSellerRequest,
  findSellerRequestByUserId,
  updateUserAddress,
  addUserAddress,
  findAddressByUserId
};