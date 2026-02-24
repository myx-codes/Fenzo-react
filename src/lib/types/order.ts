export interface OrderItemDisplay {
  productId: string;
  itemQuantity: number;
  itemPrice: number;
  productName?: string;
  productImage?: string;
}

export interface Order {
  _id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  /** Backend may return orderTotal / orderStatus */
  orderTotal?: number;
  orderStatus?: string;
  /** From backend orderItems + productData (name, image for display) */
  orderItems?: OrderItemDisplay[];
}

/** Request body for POST create order (matches backend req.body). */
export interface CreateOrderInput {
  items?: { productId: string; quantity: number; price?: number }[];
  addressId?: string;
  note?: string;
  [key: string]: unknown;
}

/** Passed via location.state when navigating to checkout for "Buy Now". */
export interface BuyNowItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}
