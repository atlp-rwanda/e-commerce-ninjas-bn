/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "../../../databases/models";
import { Op } from "sequelize";

const {Users, Sessions} = db

const createUser = async (body: any) => { 
  return await Users.create({ ...body, role:"buyer" });
};

const findUserByAttributes = async (key: string, value: any) => {
  return await Users.findOne({ where: { [key]: value } });
};

const updateUserByAttributes = async (
  updatedKey: string,
  updatedValue: any,
  whereKey: string,
  whereValue: any
) => {
  await Users.update(
    { [updatedKey]: updatedValue },
    { where: { [whereKey]: whereValue } }
  );
  return await findUserByAttributes(whereKey, whereValue);
};

const createSession = async (body: any) => {
  return await Sessions.create(body);
};

const findSessionByAttributes = async( key:string, value: any ) => {
    return await Sessions.findOne({ where: { [key]:value } });
}

const findSessionByUserIdAndToken = async (userId: string, token: string) => {
  return await Sessions.findOne({ where: { token, userId } });
};

const findTokenByDeviceIdAndUserId = async (device: string, userId: string)=>{
    const session = await Sessions.findOne({ where: {device, userId} });
    return session.token;
}

const destroySessionByAttribute = async (
  destroyKey: string,
  destroyValue: any,
  key: string,
  value: string
) => {
  return await Sessions.destroy({
    where: { [destroyKey]: destroyValue, [key]: value },
  });
};

const findSessionByUserIdOtp = async (userId:string, otp:string) => {
    return await Sessions.findOne({
      where: {
        userId: userId,
        otp: otp,
        otpExpiration: { [Op.gt]: new Date() }
      }
    });
  }


export default {
  createUser,
  createSession,
  findUserByAttributes,
  findSessionByAttributes,
  findSessionByUserIdAndToken,
  findTokenByDeviceIdAndUserId,
  updateUserByAttributes,
  destroySessionByAttribute,
  findSessionByUserIdOtp
};