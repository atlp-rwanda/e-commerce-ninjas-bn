import { usersAttributes } from "../databases/models/users";


export const userChangeRole = async(user:usersAttributes)=>{
    const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
   return (
`<div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${username},</p>
    <p>We are pleased to inform you that your ${user.role} within our system has been updated to <span style="color: green;">${user.role}</span>.</p>
    <p>With this role, you will now have access to additional features and responsibilities. If you have any questions or need further assistance,</p>
    <p>please do not hesitate to contact us.</p>
    <p>Thank you for being a valued member of our community.</p>
    <p>Best regards,</p>
    <p><strong>E-commerce ninjas Team</strong></p>
  </div>`)
}

export const userChangeStatus = async(user:usersAttributes)=>{
    const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
   return user.status === "disabled" ?(
`<div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${username},</p>
    <p>We regret to inform you that your account has been <strong style="color: red;">disabled / suspended</strong> due to a violation of our terms of service or suspicious activity.</p>
    <p>If you believe this is a mistake or need further assistance, please contact our support team at this email.</p>
    <p>Thank you for your understanding and cooperation.</p>
    <p>Best regards,</p>
    <p><strong>E-commerce ninjas Team</strong></p>
  </div>`) : (
    `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${username},</p>
    <p>We are pleased to inform you that your account has been <strong style="color: green;">re-enabled</strong>. You can now access all the features and services available to you.</p>
    <p>If you have any questions or need further assistance, please contact our support team at this email.</p>
    <p>Thank you for being a valued member of our community.</p>
    <a href="${process.env.SERVER_URL_PRO}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Go to Website</a>
    <p>Best regards,</p>
    <p><strong>e-commerce ninjas Team</strong></p>
  </div>
    `
  )
   }

export const welcomeEmail = async (user:usersAttributes)=>{
    const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
    return (`
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>👋 Dear ${username}},</p>
    <p>Welcome to <strong>E-commerce ninjas</strong>! Your account has been successfully created, and we are thrilled to have you on board. 🎉</p>
    <p>Explore our features and enjoy your experience. If you have any questions or need assistance, please don't hesitate to reach out to us at this email.</p>
    <p>Happy shopping! 🛍️</p>
    <p>Best regards,</p>
    <p><strong>E-commerce ninjas Team</strong></p>
    <a href="${process.env.SERVER_URL_PRO}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
  </div>
        `);
}