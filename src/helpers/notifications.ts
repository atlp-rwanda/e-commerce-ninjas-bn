import { sendEmailNotification } from "../services/sendEmail";
import userRepositories from "../modules/user/repository/userRepositories";
import { EventEmitter } from "events";
import cron from "node-cron";
import productRepository from "../modules/product/repositories/productRepositories";
import Products from "../databases/models/products";
import Shops from "../databases/models/shops";
import Users from "../databases/models/users";
import { IProductsWithShop } from "../types/index";
import { io } from "../index";

export const eventEmitter = new EventEmitter();

const fetchProductWithShop = async (productId: string): Promise<IProductsWithShop> => {
    return (await Products.findOne({
      where: { id: productId },
      include: { model: Shops, as: "shops" }
    })) as IProductsWithShop;
};
  
eventEmitter.on("productAdded", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has been added.`;
  await userRepositories.addNotification(userId, message);
  await sendEmailNotification(userId, message);
  io.to(userId).emit("productAdded", message);
});
  
eventEmitter.on("productRemoved", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId; 
  const message = "A Product has been removed in your shop.";
  await userRepositories.addNotification(userId, message);
  await sendEmailNotification(userId, message);
  io.to(userId).emit("productRemoved", message);
});
  
eventEmitter.on("productExpired", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has expired.`;
  await userRepositories.addNotification(userId, message);
  sendEmailNotification(userId, message);
  io.to(userId).emit("productExpired", message);
});
  
eventEmitter.on("productUpdated", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has been updated.`;
  await userRepositories.addNotification(userId, message);
  await sendEmailNotification(userId, message);
  io.to(userId).emit("productUpdated", message);
});
  
eventEmitter.on("productStatusChanged", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} status changed to ${product.status}.`;
  await userRepositories.addNotification(userId, message);
  await sendEmailNotification(userId, message);
  io.to(userId).emit("productStatusChanged", message);
});

eventEmitter.on("productBought", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has been bought.`;
  await userRepositories.addNotification(userId, message);
  await sendEmailNotification(userId, message);
  io.to(userId).emit("productBought", message);
});
  
cron.schedule("0 0 * * *", async () => {
  const users = await Users.findAll();
  for (const user of users) {
    const expiredProductsList = await productRepository.expiredProductsByUserId(user.id);
    for (const product of expiredProductsList) {
      eventEmitter.emit("productExpired", product);
    }
  }
});