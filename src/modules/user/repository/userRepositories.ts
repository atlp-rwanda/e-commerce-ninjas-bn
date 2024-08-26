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
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: db.Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "role", "profilePicture"]
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
  await db.Notifications.update({ isRead: true }, { where: { [key]: value } });
  return await db.Notifications.findOne({ where: { [key]: value } })
};

const markAllNotificationsAsRead = async (userId: string) => {
  await db.Notifications.update({ isRead: true }, { where: { userId, isRead: false } });
  return await db.Notifications.findAll({ where: { userId } })
};

const findUserById = async (id: string) => {
  return await db.Users.findOne({ where: { id } });
};

const createSellerProfile = async (request: { userId: string; requestStatus: string, sellerData: any }) => {
  try {
    const shop = await db.Shops.create({
      userId: request.userId,
      name: request.sellerData.businessName,
      description: request.sellerData.businessDescription
    })

    const newPaymentMethods = await db.PaymentMethods.create({
      userId: request.userId,
      bankPayment: request.sellerData.bankPayment,
      mobilePayment: request.sellerData.mobilePayment,
      bankAccount: request.sellerData.bankAccount,
      bankName: request.sellerData.bankName,
      mobileNumber: request.sellerData.mobileNumber
    })

    const newSellerRequest = await db.SellerProfile.create({
      userId: request.userId,
      shopsId: shop.id,
      paymentMethodId: newPaymentMethods.id,
      requestStatus: request.requestStatus,
      businessName: request.sellerData.businessName,
      tin: request.sellerData.Tin,
      rdbDocument: request.sellerData.rdbDocument,
      terms: request.sellerData.terms
    });

    return { sellerRequest: newSellerRequest, paymentMethods: newPaymentMethods };
  } catch (error) {
    console.error(error);
  }

};
const getAllSellerProfile = async () => {
  return await db.SellerProfile.findAll({
    include: [
      {
        model: db.Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "role", "profilePicture", "phone", "gender", "birthDate", "language"]
      },
      {
        model: db.Shops,
        as: "shop",
        attributes: ["id", "name", "description"]
      },
      {
        model: db.PaymentMethods,
        as: "paymentMethods",
        attributes: ["id", "bankPayment", "mobilePayment", "bankAccount", "mobileNumber"]
      }
    ]
  });
}

const findSellerRequestByUserId = async (userId: string) => {
  return await db.SellerProfile.findOne({
    where: { userId },
    include: [
      {
        model: db.Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "role", "profilePicture", "phone", "gender", "birthDate", "language"]
      },
      {
        model: db.Shops,
        as: "shop",
        attributes: ["id", "name", "description"]
      },
      {
        model: db.PaymentMethods,
        as: "paymentMethods",
        attributes: ["id", "bankPayment", "mobilePayment", "bankAccount", "mobileNumber"]
      }
    ]
  });
};

const updateSellerProfile = async (request: any, id: string) => {
  try {
    await db.SellerProfile.update(request, { where: { userId: id }, returning: true });
    const updateRequest = await findSellerRequestByUserId(id);
    return updateRequest;
  } catch (error) {
    console.error("Error updating seller request:", error);
    throw error;
  }
}
const updateSellerProfileAndUserStatus = async(request: any,id: string)=>{
  try {
    await db.SellerProfile.update(request, { where: { userId: id }, returning: true });
    await db.Users.update({role:"seller"}, { where: { id},returning:true});
    const updateRequest = await findSellerRequestByUserId(id);
    return updateRequest;
  } catch (error) {
    console.error("Error updating seller request:", error);
    throw error;
  }
}
const deleteSellerProfile = async (id: string) => {
  await db.SellerProfile.destroy({ where: { id } });
}

const createTermsAndCondition = async (content: string, type: string) => {
  return await db.TermsAndConditions.create({ content, type });
}

const createTermsAndConditionWithUrl = async(url: string,type:string) => {
  return await db.TermsAndConditions.create({ pdfUrl: url, type });
}
const getTermsAndCondition = async () => {
  return await db.TermsAndConditions.findAll();
};

const UpdateTermsAndCondition = async (data: any, id: string) => {
  await db.TermsAndConditions.update({ ...data }, { where: { id }, returning: true });
  const updateTermsAndCondition = await db.TermsAndConditions.findOne({ where: { id} });
  return updateTermsAndCondition;
}

const deleteTermsAndCondition = async (id: string) => {
  await db.TermsAndConditions.destroy({ where: { id } });
};

const getTermsAndConditionById = async (id: string) => {
  return await db.TermsAndConditions.findOne({ where: { id } });
};

const findTermByType = async (type: string) => {
  return await db.TermsAndConditions.findOne({ where: { type } });
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

const getAllShops = async () => {
  return await db.Shops.findAll();
};

const findSettingByKey = async (key: string) => {
  return await db.Settings.findOne({ where: { key } });
};

const createSetting = async (key: string, value: string) => {
  return await db.Settings.create({ key, value });
};

const updateSettingValue = async (setting: any, value: string) => {
  setting.value = value;
  return await setting.save();
};

const deleteUser = async (id:string) => {
  return await db.Users.destroy({ where: { id } });
}

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
  createSellerProfile,
  findSellerRequestByUserId,
  updateUserAddress,
  addUserAddress,
  findAddressByUserId,
  getAllShops,
  findSettingByKey,
  createSetting,
  updateSettingValue,
  getAllSellerProfile,
  updateSellerProfile,
  createTermsAndCondition,
  getTermsAndCondition,
  UpdateTermsAndCondition,
  deleteSellerProfile,
  updateSellerProfileAndUserStatus,
  deleteTermsAndCondition,
  getTermsAndConditionById,
  findTermByType,
  deleteUser,
  createTermsAndConditionWithUrl
};