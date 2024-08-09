import { usersAttributes } from "../databases/models/users";

export const userChangeRole = async (user: usersAttributes) => {
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
  return (
    `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${username},</p>
    <p>We are pleased to inform you that your role within our system has been updated to <span style="color: green;">${user.role}</span>.</p>
    <p>With this role, you will now have access to additional features and responsibilities. If you have any questions or need further assistance,</p>
    <p>please do not hesitate to contact us.</p>
    <p>Thank you for being a valued member of our community.</p>
    <p>Best regards,</p>
    <p><strong>E-commerce ninjas Team</strong></p>
  </div>`)
}

export const userChangeStatus = async (user: usersAttributes) => {
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
  return user.status === "disabled" ? (
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
    <p>We are pleased to inform you that your account has been <strong style="color: green;">re-enabled / re-activated</strong>. You can now access all the features and services available to you.</p>
    <p>If you have any questions or need further assistance, please contact our support team at this email.</p>
    <p>Thank you for being a valued member of our community.</p>
    <a href="${process.env.SERVER_URL_PRO}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #ff6d18; text-decoration: none; border-radius: 5px;">Go to Website</a>
    <p>Best regards,</p>
    <p><strong>e-commerce ninjas Team</strong></p>
  </div>
    `
  )
}

export const welcomeEmail = async (user: usersAttributes, isSeller: boolean = false) => {
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];

  const buyerMessage = `
    <p>Welcome to <strong>E-commerce ninjas</strong>! Your account has been successfully created, and we are thrilled to have you on board. 🎉</p>
    <p>Explore our features and enjoy your experience. If you have any questions or need assistance, please don't hesitate to reach out to us at this email.</p>
    <p>Happy shopping! 🛍️</p>
  `;

  const sellerMessage = `
    <p>Welcome to <strong>E-commerce ninjas</strong>! Your account has been successfully created, and we are thrilled to have you on board as a seller. 🎉</p>
    <p>Please note that your account is currently under review. You will be notified shortly once your request is approved or rejected.</p>
    <p>Thank you for choosing our platform to grow your business! 🚀</p>
  `;

  return (`
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>👋 Dear ${username},</p>
      ${isSeller ? sellerMessage : buyerMessage}
      <p>Best regards,</p>
      <p><strong>E-commerce ninjas Team</strong></p>
      <a href="${process.env.SERVER_URL_PRO}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #ffffff; background-color: #ff6d18; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
    </div>
  `);
}


export const passwordResetEmail =  (user: usersAttributes, token) => {
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
  return (`
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>👋 Dear ${username},</p>
      <p>We received a request to reset the password for your account on <strong>E-commerce Ninjas</strong>. If you did not make this request, please ignore this email. Otherwise, you can reset your password using the link below:</p>
      <p>
        <a href="${process.env.SERVER_URL_PRO}/api/auth/reset-password/${token}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #ffffff; background-color: #ff6d18; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </p>
      <p>If the button above does not work, copy and paste the following URL into your browser:</p>
      <p>${process.env.SERVER_URL_PRO}/api/auth/reset-password/${token}</p>
      <p>This link will expire in 24 hours for your security. If the link does not work, copy and paste the following URL into your browser:</p>
      <p>If you have any questions or need further assistance, feel free to reach out to us at this email.</p>
      <p>Best regards,</p>
      <p><strong>E-commerce Ninjas Team</strong></p>
    </div>
  `)
};

export const getEmailVerificationTemplate = (user:usersAttributes, token) => {
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>👋 Dear ${username},</p>
      <p>Thank you for registering with <strong>E-commerce Ninjas</strong>! To complete your registration and verify your email address, please click the link below:</p>
      <p>
        <a href="${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #ff6d18; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
      </p>
      <p>If the button above does not work, copy and paste the following URL into your browser:</p>
      <p>${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}</p>
      <p>This verification link will expire in 24 hours for your security. If you did not register an account, please disregard this email.</p>
      <p>If you have any questions or need further assistance, feel free to reach out to us at this email.</p>
      <p>Best regards,</p>
      <p><strong>E-commerce Ninjas Team</strong></p>
    </div>
  `;
}


export const getResendVerificationTemplate = (user: usersAttributes, token) => {
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>👋 Dear ${username},</p>
      <p>We noticed that you haven't verified your email address yet for your <strong>E-commerce Ninjas</strong> account. Please verify your email to complete your registration.</p>
      <p>
        <a href="${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #ff6d18; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
      </p>
      <p>If the button above does not work, copy and paste the following URL into your browser:</p>
      <p>${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}</p>
      <p>This verification link will expire in 24 hours for your security. If you did not register an account, please disregard this email.</p>
      <p>If you need further assistance, please don't hesitate to contact us at this email.</p>
      <p>Best regards,</p>
      <p><strong>E-commerce Ninjas Team</strong></p>
    </div>
  `;
};

export const generateOtpEmailTemplate = (user:usersAttributes, otp) =>{
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>👋 Dear ${username},</p>
      <p>For your security, please use the following One-Time Password (OTP) to verify your identity:</p>
      <p style="font-size: 20px; font-weight: bold;">${otp}</p>
      <p>This OTP is valid for a limited time only. If you did not request this, please ignore this email or contact our support team.</p>
      <p>Best regards,</p>
      <p><strong>E-commerce Ninjas Team</strong></p>
    </div>
  `;
}

export const sellerProfileStatusEmail = async (user: usersAttributes, status: string) => {
  const username = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split("@")[0];
  const statusColor = status === "Accepted" ? "green" : "red";
  const statusMessage = status === "Accepted"
    ? "We are pleased to inform you that your request to become a seller has been accepted. You can now start selling your products on our platform."
    : "We regret to inform you that your request to become a seller has been rejected. Please feel free to contact us for further clarification or to reapply in the future.";
  
  return (
    `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear ${username},</p>
      <p>Your request to become a seller on our platform has been <span style="color: ${statusColor};">${status}</span>.</p>
      <p>${statusMessage}</p>
      <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>
      <p>Thank you for your interest in becoming a seller on our platform.</p>
      <p>Best regards,</p>
      <p><strong>E-commerce Ninjas Team</strong></p>
    </div>`
  );
}
