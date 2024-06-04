import { Op } from "sequelize";
import OrderProduct from "../../../databases/models/orderProducts";
import Order from "../../../databases/models/orders";
import Products from "../../../databases/models/products";

const getOrdersPerTimeframe = async (sellerId: number, startDate: Date, endDate: Date) => {
    return await Order.findAll({ where: { orderDate: { [Op.gte]: startDate, [Op.lte]: endDate }, userId: sellerId }});
};

const getOrderProductsByOrderId = (orderId: number) => {
    return OrderProduct.findAll({where: {orderId}});
}

const findProductById = (id: number) => {
    return Products.findOne({where: {id}});
}

export default { getOrdersPerTimeframe, getOrderProductsByOrderId, findProductById };
