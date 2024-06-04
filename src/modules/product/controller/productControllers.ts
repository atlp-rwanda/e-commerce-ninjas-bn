import { Request, Response } from "express";
import httpStatus from "http-status";
import { IProductSold, IRequest } from "../../../types";
import productRepositories from "../repository/productRepositories";

const getSellerStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.body;
    const sellerId = (req as IRequest).userId;
    const orders = await productRepositories.getOrdersPerTimeframe(sellerId, new Date(startDate), new Date(endDate));
    
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProducts = 0;
    const productsSoldMap = new Map<number, IProductSold>();

    await Promise.all(orders.map(async (order) => {
      totalOrders += 1;
      totalRevenue += order.amount;
      
      const allProducts = await productRepositories.getOrderProductsByOrderId(order.id);
      
      await Promise.all(allProducts.map(async (product) => {
        totalProducts += 1;
        const productName = (await productRepositories.findProductById(product.id)).name;
        
        if (productsSoldMap.has(product.id)) {
          productsSoldMap.get(product.id)!.quantity += product.quantity;
        } else {
          productsSoldMap.set(product.id, { product: productName, quantity: product.quantity });
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