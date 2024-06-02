/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import httpStatus from "http-status";
import productRepositories from "../repositories/productRepositories";
import uploadImages from "../../../helpers/uploadImage";
import { ExtendRequest } from "../../../types";

const createProduct = async (req: ExtendRequest, res: Response) => {
  try {
    const uploadPromises = req.files.map((file) => uploadImages(file));
    const images = await Promise.all(uploadPromises);
    const productData = {
      collectionId: req.params.id,
      sellerId: req.user.id,
      images: images.map((image) => image.secure_url),
      ...req.body,
    };
    const product = await productRepositories.createProduct(productData);
    res.status(httpStatus.CREATED).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const updateProduct = async (req: ExtendRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const uploadPromises = req.files.map((file) => uploadImages(file));
    const images = await Promise.all(uploadPromises);
    const productData = {
      images: images.map((image) => image.secure_url),
      ...req.body,
    };
    const product = await productRepositories.updateProduct(
      productData,
      productId
    );

    res
      .status(httpStatus.OK)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const createCollections = async (req: ExtendRequest, res: Response) => {
  try {
    const collectionData = {
      sellerId: req.user.id,
      name: req.body.name,
      description: req.body.description,
    };
    const collection = await productRepositories.createCollection(
      collectionData
    );
    res.status(httpStatus.CREATED).json({
      message: "Collection created successfully",
      data: collection,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};
export default { createProduct, updateProduct, createCollections };
