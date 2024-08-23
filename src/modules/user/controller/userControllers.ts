/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import { uploadImages} from "../../../helpers/uploadImage";
import userRepositories from "../repository/userRepositories";
import authRepositories from "../../auth/repository/authRepositories";
import { sendEmail } from "../../../services/sendEmail";
import { eventEmitter } from "../../../helpers/notifications";
import fs from 'fs';
import { sellerProfileStatusEmail } from "../../../services/emailTemplate";

const adminGetUsers = async (req: Request, res: Response) => {
  try {
    const user = await userRepositories.getAllUsers();
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const adminGetUser = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.findUserByAttributes(
      "id",
      req.params.id
    );
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    await userRepositories.deleteUser(req.params.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.updateUserByAttributes(
      "role",
      req.body.role,
      "id",
      req.params.id
    );
    eventEmitter.emit("UserChangeRole",user);
      return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "User role updated successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const user = await authRepositories.updateUserByAttributes(
      "status",
      req.body.status,
      "id",
      userId
    );
    eventEmitter.emit("UserChangeStatus", user);
    res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, message: "Status updated successfully.", data: { user } });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};
const getUserDetails = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.findUserByAttributes("id", req.user.id);
    res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, data: { user } });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    let profilePicture;
    if (req.file) {
      const upload = await uploadImages(req.file);
      profilePicture = upload.secure_url;
    }
    const userData = { ...req.body, profilePicture };
    const user = await userRepositories.updateUserProfile(
      userData,
      req.user.id
    );
    res
      .status(httpStatus.OK)
      .json({
        status: httpStatus.OK,
        message: "User profile updated successfully",
        data: { user }
      });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const changePassword = async (req: any, res: Response) => {
  try {
    const user = await authRepositories.updateUserByAttributes(
      "password",
      req.user.password,
      "id",
      req.user.id
    );
    eventEmitter.emit("passwordChanged", { userId: req.user.id, message: "Password changed successfully" });
    return res
      .status(httpStatus.OK)
      .json({status:httpStatus.OK,
         message: "Password updated successfully", 
         data: { user } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await userRepositories.findNotificationsByuserId(req.user.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { notifications }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getSingleNotification = async (req: Request, res: Response) => {
  try {
    const notification = await userRepositories.findNotificationById(req.user.id, req.params.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message:"Notification fetched successfully",
      data: { notification },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await userRepositories.markNotificationAsRead("id", req.params.id);
    res.status(httpStatus.OK).json({
      status:httpStatus.OK,
      message: "Notification marked as read",
      data: { notification: notification }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const notifications = await userRepositories.markAllNotificationsAsRead(req.user.id);
    res.status(httpStatus.OK).json({
      status:httpStatus.OK,
      message: "All notifications marked as read",
      data: { notifications }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const submitSellerRequest = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    if(req.file){
      const result= await uploadImages(req.file);
      req.body.rdbDocument = result.secure_url;
    }
    const sellerData : any = {
        ...req.body,
        rdbDocument: req.body.rdbDocument,
  }
    const sellerRequest = await userRepositories.createSellerProfile({
      userId,
      requestStatus: "Pending",
      sellerData
    });

    await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Seller Request",
      `A new seller request has been submitted by user ID: ${userId}.`
    );

    await sendEmail(
      req.user.email,
      "Seller Request Submitted",
      "Your request to become a seller has been submitted successfully. We will notify you once it is reviewed."
    );

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Seller request submitted successfully",
      data: {sellerRequest},
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const adminGetAllSellerRequested = async (req: Request, res:Response) => {
  try {
    const sellerProfiles = await userRepositories.getAllSellerProfile();
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { sellerProfiles },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}

const adminGetRequestDetails = async (req: Request, res:Response) => {
  try {
    const sellerRequest = await userRepositories.findSellerRequestByUserId(req.params.userId);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message:"Seller request details successfully",
      data: { sellerRequest },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
}

const adminAcceptOrDenyRequest = async (req: any, res: Response) => {
  try {
    let updatedSellerRequest = null;

    switch (req.requestStatus) {
      case "Accepted":
        updatedSellerRequest = await userRepositories.updateSellerProfileAndUserStatus(
          { requestStatus:req.requestStatus },
          req.params.userId,
        );
        break;

      case "Rejected":
        updatedSellerRequest = await userRepositories.updateSellerProfile(
          { requestStatus:req.requestStatus },
          req.params.userId,
        );
        break;

      default:
        return res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid request status",
        });
    }
    await sendEmail(
      req.user.email,
      `Seller Request ${req.requestStatus}`,
      await sellerProfileStatusEmail(req.user, req.requestStatus)
    );

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: `Seller request ${req.requestStatus} successfully`,
      data: { sellerRequest: updatedSellerRequest },
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const adminDeleteSellerRequest =async (req:Request , res:Response) =>{
  try {
    await userRepositories.deleteSellerProfile(req.params.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Seller request deleted successfully",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}

const adminSetTermsAndCondition = async (req: Request, res: Response) =>{
  try {
    const termsAndCondition = await userRepositories.createTermsAndCondition(req.body.content,req.body.type)
    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "Terms and condition created successfully",
      data: { termsAndCondition },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    })
  }
}

const adminSetTermsAndConditionWithPdf =  async (req: Request, res: Response) =>{
  try {
    if(req.file){
      const result= await uploadImages(req.file);
      req.body.content = result.secure_url;
    }
    const termsAndCondition = await userRepositories.createTermsAndConditionWithUrl(req.body.content,req.body.type)
    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "Terms and condition created successfully",
      data: { termsAndCondition },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    })
  }
}

const adminGetTermsAndCondition = async (req: Request, res: Response) =>{
  try {
    const termsAndCondition = await userRepositories.getTermsAndCondition()
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { termsAndCondition },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}

const adminDeleteTermsAndCondition = async (req: Request, res: Response) =>{
  try {
    await userRepositories.deleteTermsAndCondition(req.params.id)
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Terms and condition deleted successfully",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}

const adminGetSingleTermsAndCondition = async (req: Request, res: Response)=>{
  try {
    const termsAndCondition = await userRepositories.getTermsAndConditionById(req.params.id)
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { termsAndCondition },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}
const adminUpdateTermsAndCondition = async(req: Request, res: Response) =>{
  try {
    if(req.file){
      const result= await uploadImages(req.file);
      req.body.pdfUrl = result.secure_url;
    }
    const updatedTermsAndCondition = await userRepositories.UpdateTermsAndCondition(req.body,req.params.id)
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Terms and condition updated successfully",
      data: { termsAndCondition: updatedTermsAndCondition },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}
const changeUserAddress = async (req: any, res: Response) => {
  try {
    const isAddressFound = await userRepositories.findAddressByUserId(req.user.id)
    let createdAddress;
    if(!isAddressFound){
      createdAddress = await userRepositories.addUserAddress({ ...req.body, userId: req.user.id})
    }
    else {
      createdAddress = await userRepositories.updateUserAddress(req.body, req.user.id)
    }
    return res
      .status(httpStatus.OK)
      .json({status:httpStatus.OK,
         message: `${isAddressFound ? "Address updated successfully" : "Address added successfully"}`, 
         data: { address: createdAddress } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updatePasswordExpirationSetting = async (req: Request, res: Response) => {
  try {    
      const { minutes } = req.body;   
      let setting = await userRepositories.findSettingByKey("PASSWORD_EXPIRATION_MINUTES");  
    if (!setting) {
      setting = await userRepositories.createSetting("PASSWORD_EXPIRATION_MINUTES", minutes);
    } else {
      setting = await userRepositories.updateSettingValue(setting, minutes);
    }
    res.status(httpStatus.OK).json({ message: "Password expiration setting updated successfully." });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const getPasswordExpiration = async (req: Request, res: Response) => {
  try {
    const setting = await userRepositories.findSettingByKey("PASSWORD_EXPIRATION_MINUTES");
    if (setting) {
      res.status(200).json({ minutes: setting.value });
    } else {
      res.status(404).json({ message: "Password expiration setting not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch password expiration time." });
  }
};

export default {
  updateUserStatus,
  updateUserRole,
  adminGetUsers,
  adminGetUser,
  updateUserProfile,
  getUserDetails,
  changePassword,
  getAllNotifications,
  getSingleNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  submitSellerRequest,
  changeUserAddress,
  updatePasswordExpirationSetting,
  getPasswordExpiration,
  adminGetAllSellerRequested,
  adminGetRequestDetails,
  adminAcceptOrDenyRequest,
  adminDeleteSellerRequest,
  adminSetTermsAndCondition,
  adminGetTermsAndCondition,
  adminGetSingleTermsAndCondition,
  adminDeleteTermsAndCondition,
  adminUpdateTermsAndCondition,
  adminDeleteUser,
  adminSetTermsAndConditionWithPdf,
};