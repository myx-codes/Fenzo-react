import { User } from "./user";
import { Product } from "./product";

export interface TopSellingProduct {
  _id: string;
  unitsSold: number;
  productName: string;
  productPrice: number;
  productImages: string[];
}

/** Response from GET /user/seller/:userId - real seller data from database */
export interface SellerProfile {
  user: User;
  productsAdded: number;
  products: Product[];
  productsSold: number;
  totalRevenue: number;
  topSellingProducts: TopSellingProduct[];
}
