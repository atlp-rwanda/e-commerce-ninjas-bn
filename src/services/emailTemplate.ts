import { usersAttributes } from "../databases/models/users";

export const userChangeRole = async(user:usersAttributes)=>{
   return (
`<div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${user.firstName +" "+ user.lastName},</p>
    <p>We are pleased to inform you that your ${user.role} within our system has been updated to <span style="color: #1100ff; font-size: 1rem">${user.role}</span>.</p>
    <p>With this role, you will now have access to additional features and responsibilities. If you have any questions or need further assistance,</p>
    <p>please do not hesitate to contact us.</p>
    <p>Thank you for being a valued member of our community.</p>
    <p>Best regards,</p>
    <p><strong>E-commerce ninjas Team</strong></p>
  </div>`)
}

export const userChangeStatus = async(user:usersAttributes)=>{
   return user.status === "disabled" ?(
`<div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${user.firstName + " " + user.lastName},</p>
    <p>We regret to inform you that your account has been <strong style="color: red;">disabled / suspended</strong> due to a violation of our terms of service or suspicious activity.</p>
    <p>If you believe this is a mistake or need further assistance, please contact our support team at this email.</p>
    <p>Thank you for your understanding and cooperation.</p>
    <p>Best regards,</p>
    <p><strong>E-commerce ninjas Team</strong></p>
  </div>`) : (
    `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${user.firstName +" "+ user.lastName},</p>
    <p>We are pleased to inform you that your account has been <strong style="color: green;">re-enabled</strong>. You can now access all the features and services available to you.</p>
    <p>If you have any questions or need further assistance, please contact our support team at this email.</p>
    <p>Thank you for being a valued member of our community.</p>
    <p>Best regards,</p>
    <p><strong>e-commerce ninjas Team</strong></p>
  </div>
    `
  )
   }