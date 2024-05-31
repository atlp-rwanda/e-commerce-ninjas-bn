/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Users from "../../../databases/models/users";
import Session from "../../../databases/models/session";

const createUser = async (body: any) => { 
  return await Users.create({ ...body, role:'buyer' });
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
  return await Session.create(body);
};

const findSessionByAttributes = async( key:string, value: any ) => {
    return await Session.findOne({ where: { [key]:value } });
}

const findSessionByUserIdAndToken = async (userId: number, token: string) => {
  return await Session.findOne({ where: { token, userId } });
};

const findTokenByDeviceIdAndUserId = async (device: string, userId: number)=>{
    const session = await Session.findOne({ where: {device, userId} });
    return session.token;
}

const destroySession = async (userId: number, token:string) =>{
    return await Session.destroy({ where: {userId, token } });
}

export default {
  createUser,
  createSession,
  findUserByAttributes,
  destroySession,
  updateUserByAttributes,
  findSessionByAttributes,
  findSessionByUserIdAndToken,
  findTokenByDeviceIdAndUserId,
};
