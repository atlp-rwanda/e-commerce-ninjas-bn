import { Op } from "sequelize";
import OrderProduct from "../../../databases/models/orderProducts";
import Order from "../../../databases/models/orders";
import Products from "../../../databases/models/products";
import Shop from "../../../databases/models/shops";

const getOrdersPerTimeframe = async (shopId: number, startDate: Date, endDate: Date) => {
    return await Order.findAll({ where: { orderDate: { [Op.gte]: startDate, [Op.lte]: endDate }, shopId }});
};

const getOrderProductsByOrderId = (orderId: number) => {
    return OrderProduct.findAll({where: {orderId}});
}

const findProductById = (id: number) => {
    return Products.findOne({where: {id}});
}

const findShopByUserId = async(userId: number) => {
    return await Shop.findOne({ where: { userId }})
}

export default { getOrdersPerTimeframe, getOrderProductsByOrderId, findProductById, findShopByUserId };
