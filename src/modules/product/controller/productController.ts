/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import httpStatus from "http-status";
import productRepositories from "../repositories/productRepositories";
import uploadImages from "../../../helpers/uploadImage";
import { ExtendRequest, IProductSold } from "../../../types";
import Products from "../../../databases/models/products";

const sellerCreateProduct = async (req: ExtendRequest, res: Response) => {
  try {
    const uploadPromises = req.files.map((file) => uploadImages(file));
    const images = await Promise.all(uploadPromises);
    const productData = {
      shopId: req.shop.id,
      images: images.map((image) => image.secure_url),
      ...req.body,
    };
    const product = await productRepositories.createProduct(productData);
    res.status(httpStatus.CREATED).json({
      message: "Product created successfully",
      data: { product: product },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const sellerCreateShop = async (req: ExtendRequest, res: Response) => {
  try {
    const shopData = {
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description,
    };
    const shop = await productRepositories.createShop(shopData);
    res.status(httpStatus.CREATED).json({
      message: "Shop created successfully",
      data: { shop: shop },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const sellerDeleteProduct = async (req: ExtendRequest, res: Response) => {
  try {
    await productRepositories.deleteProductById(req.params.id);
    res.status(httpStatus.OK).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

const sellerGetStatistics = async (
  req: ExtendRequest,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate } = req.body;
    const shop = await productRepositories.findShopByUserId(req.user.id);
    const orders = await productRepositories.getOrdersPerTimeframe(
      shop.id,
      new Date(startDate),
      new Date(endDate)
    );

    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProducts = 0;
    const productsSoldMap = new Map<number | string, IProductSold>();

    await Promise.all(
      orders.map(async (order) => {
        totalOrders += 1;
        const allCartProducts =
          await productRepositories.getOrderProductsByCartId(order.cartId);

        await Promise.all(
          allCartProducts.map(async (cartProduct) => {
            totalRevenue += cartProduct.totalPrice;
            const product = await productRepositories.findProductById(
              cartProduct.productId
            );
            if (productsSoldMap.has(cartProduct.productId)) {
              productsSoldMap.get(cartProduct.productId)!.quantity +=
                cartProduct.quantity;
            } else {
              totalProducts += 1;
              productsSoldMap.set(cartProduct.productId, {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: cartProduct.quantity,
              });
            }
          })
        );
      })
    );

    const productsSold = Array.from(productsSoldMap.values());

    const sortedProductSales = productsSold
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const data = {
      totalOrders,
      totalRevenue,
      totalProducts,
      bestSellingProducts: sortedProductSales,
    };

    res.status(httpStatus.OK).json({
      message: `Seller's statistics from ${startDate} to ${endDate}`,
      data,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateProductStatus = async (req: ExtendRequest, res: Response) => {
  try {
    const data = await productRepositories.updateProductByAttributes(
      "status",
      req.body.status,
      "id",
      req.params.id
    );
    res
      .status(httpStatus.OK)
      .json({ message: "Status updated successfully.", data });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const sellerGetProducts = async (req: ExtendRequest, res: Response) => {
  try {
    await productRepositories.markProducts(req.shop.id);
    const products = await productRepositories.sellerGetProducts(req.shop.id);
    res.status(httpStatus.OK).json({
      message: "All products fetched successfully.",
      products,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const sellerUpdateProduct = async (req: ExtendRequest, res: Response) => {
  try {
    const uploadPromises = req.files.map((file) => uploadImages(file));
    const images = await Promise.all(uploadPromises);
    const imagesArr = images.map((image) => image.secure_url);

    const updatedProductData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount,
      category: req.body.category,
      expiryDate: req.body.expiryDate,
      bonus: req.body.bonus,
      quantity: req.body.quantity,
      images: imagesArr,
    };

    const { id: productId } = req.params;
    const updatedProduct = await productRepositories.updateProduct(
      Products,
      updatedProductData,
      "id",
      productId
    );

    res.status(httpStatus.OK).json({
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
  }
};

export default {
  sellerCreateProduct,
  sellerCreateShop,
  sellerUpdateProduct,
  sellerDeleteProduct,
  sellerGetStatistics,
  updateProductStatus,
  sellerGetProducts,
};
