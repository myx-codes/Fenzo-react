import { ProductCollection, ProductGender, ProductStatus, ProductType, ProductUnit } from "../enums/product.enums";

export interface Product {
  _id: string;
  userId: string;
  productStatus: ProductStatus;
  productType: ProductType;
  productCollection: ProductCollection;
  productName: string;
  productDesc: string;
  productPrice: number;
  productDiscountPrice: number;
  productStock: number;
  productUnit: ProductUnit;
  productGender: ProductGender;
  productImages: string[];
  productViews: number;
  productLikes: number;
  productRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order?: "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "TOP_RATED";
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}
