/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"
import httpStatus from "http-status";
import { ExtendRequest } from "../../../types";
import uploadImages from "../../../helpers/uploadImage";
import productRepositories from "../repositories/productRepositories";


const createProduct = async (req:ExtendRequest,res:Response) =>{
  try {
      const uploadPromises = req.files.map(file => uploadImages(file));
      const images = await Promise.all(uploadPromises);
      const productData = {
        shopId: req.shop.id,
        images: images.map(image => image.secure_url),
        ...req.body
      };    
      const product = await productRepositories.createProduct(productData);
      res.status(httpStatus.CREATED).json({
        message: "Product created successfully",
        data: { product: product }
      });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: error.message
      });
    }
  };

const createShop = async (req: ExtendRequest, res: Response) => {
  try {
    const shopData = {
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description
    };
    const shop = await productRepositories.createShop(shopData);
    res.status(httpStatus.CREATED).json({
      message: "Shop created successfully",
      data: {shop: shop}
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
  }
};


const paginatedProducts = async (req: any, res: Response) => {
  try {
      const results = req.paginationResults;
      return res.json({ status: httpStatus.OK, data: results });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

export default { paginatedProducts,createProduct,createShop }