import { sendEmailNotification, sendEmailOrderStatus } from "../services/sendEmail";
import userRepositories from "../modules/user/repository/userRepositories";
import { EventEmitter } from "events";
import cron from "node-cron";
import productRepository from "../modules/product/repositories/productRepositories";
import Products from "../databases/models/products";
import Shops from "../databases/models/shops";
import Users from "../databases/models/users";
import { IProductsWithShop, IOrderWithCart } from "../types/index";
import { io } from "../index";
import Orders from "../databases/models/orders";
import Carts from "../databases/models/carts";

export const eventEmitter = new EventEmitter();

const fetchProductWithShop = async (productId: string): Promise<IProductsWithShop> => {
  return (await Products.findOne({
    where: { id: productId },
    include: { model: Shops, as: "shops" }
  })) as IProductsWithShop;
};

const saveAndEmitNotification = async (userId: string, message: string, event: string) => {
  await userRepositories.addNotification(userId, message); 
  io.to(userId).emit(event, message);
  await sendEmailNotification(userId, message);
};

const emitNotification = async (userId:string, message:string, event:string) => {
  await userRepositories.addNotification(userId,message)
  io.to(userId).emit(event, message);
}

const fetchOrderWithCarts = async (orderId: string): Promise<IOrderWithCart> => {
  return (await Orders.findOne({
    where: { id: orderId },
    include: { model: Carts, as: "carts" }
  })) as IOrderWithCart;
};
  
eventEmitter.on("productAdded", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has been added.`;
  await saveAndEmitNotification(userId, message, "productAdded");
});

eventEmitter.on("productRemoved", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId; 
  const message = "A Product has been removed in your shop.";
  await saveAndEmitNotification(userId, message, "productRemoved");
});

eventEmitter.on("productExpired", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has expired.`;
  await saveAndEmitNotification(userId, message, "productExpired");
});

eventEmitter.on("productUpdated", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has been updated.`;
  await saveAndEmitNotification(userId, message, "productUpdated");
});

eventEmitter.on("productStatusChanged", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} status changed to ${product.status}.`;
  await saveAndEmitNotification(userId, message, "productStatusChanged");
});

eventEmitter.on("productBought", async (product) => {
  const productWithShop = await fetchProductWithShop(product.id);
  const userId = productWithShop.shops.userId;
  const message = `Product ${product.name} has been bought.`;
  await saveAndEmitNotification(userId, message, "productBought");
});

eventEmitter.on("passwordChanged", async ({ userId, message }) => {
  await saveAndEmitNotification(userId, message, "passwordChanged");
});

eventEmitter.on("passwordExpiry", async ({ userId, message }) => {
  await saveAndEmitNotification(userId, message, "passwordExpiry");
});

eventEmitter.on("UserChangeRole", async ({userId,message}) => {
  await emitNotification(userId, message, "UserChangeRole");
})
eventEmitter.on("UserChangeStatus", async ({userId,message}) => {
  await emitNotification(userId, message, "UserChangeStatus");
})

eventEmitter.on("orderStatusUpdated", async (order) => {
  const orderStatus = await fetchOrderWithCarts(order.id)
  const userId = orderStatus.carts.userId
  const message = order.shippingProcess;
  await userRepositories.addNotification(userId, message);
  await sendEmailOrderStatus(userId, message);
  io.to(userId).emit("orderStatusUpdated", message)
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
