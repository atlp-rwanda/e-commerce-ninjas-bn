import Product from "../databases/models/products";
import { Op } from "sequelize";
import { sendEmail } from "../services/sendEmail";
import Shop from "../databases/models/shops";
import User from "../databases/models/users";

const updateExpiredProducts = async () => {
  try {
    const expiredProducts = await Product.findAll({
      where: {
        expiryDate: { [Op.lt]: new Date() },
        expired: false
      },
      attributes: ["id", "shopId", "name"]
    });

    for (const product of expiredProducts) {
      await product.update({
        expired: true,
        status: "unavailable"
      });
    }

    const shopIds = expiredProducts.map((product) => product.shopId);
    const shops = await Shop.findAll({
      where: {
        id: {
          [Op.in]: shopIds
        }
      },
      attributes: ["id", "userId"]
    });

    const userIds = shops.map((shop) => shop.userId);

    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: userIds
        }
      },
      attributes: ["id", "email", "firstName"]
    });

    const userMap = {};
    users.forEach((user) => {
      userMap[user.id] = {
        email: user.email,
        firstName: user.firstName
      };
    });

    for (const product of expiredProducts) {
      const UserShop = shops.find((shop) => shop.id === product.shopId);
      if (UserShop) {
        const user = userMap[UserShop.userId];
        if (user) {
          await sendEmail(
            user.email,
            "Product Expired",
            `Dear ${user.firstName}, your product ${product.name} has expired and now is unavailable.`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error updating expired products:", error.message);
  }
};

export default updateExpiredProducts;
