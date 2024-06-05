import { Request, Response } from "express";
import httpStatus from "http-status";
import { IProductSold, IRequest } from "../../../types";
import productRepositories from "../repository/productRepositories";

const getSellerStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.body;
    const shop = await productRepositories.findShopByUserId((req as IRequest).user.id);
    const orders = await productRepositories.getOrdersPerTimeframe(shop.id, new Date(startDate), new Date(endDate));

    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProducts = 0;
    const productsSoldMap = new Map<number, IProductSold>();

    await Promise.all(orders.map(async (order) => {
      totalOrders += 1;
      totalRevenue += order.amount;

      const allOrderProducts = await productRepositories.getOrderProductsByOrderId(order.id);

      await Promise.all(allOrderProducts.map(async (orderProduct) => {
        const product = await productRepositories.findProductById(orderProduct.productId);
        if (productsSoldMap.has(orderProduct.productId)) {
          productsSoldMap.get(orderProduct.productId)!.quantity += orderProduct.quantity;
        } else {
          totalProducts += 1;
          productsSoldMap.set(orderProduct.productId, { id: product.id, name: product.name, price: product.price, quantity: orderProduct.quantity });
        }
      }));

    }));

    const productsSold = Array.from(productsSoldMap.values());

    const sortedProductSales = productsSold
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const data = {
      totalOrders,
      totalRevenue,
      totalProducts,
      bestSellingProducts: sortedProductSales
    };

    res.status(httpStatus.OK).json({ message: `Seller's statistics from ${startDate} to ${endDate}`, data });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};



export default { getSellerStatistics };