import axios from "axios";
import { serverApi } from "../../lib/config";
import { Order, CreateOrderInput } from "../../lib/types/order";

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /**
   * Create order. Uses backend logic: createOrder(req.user, req.body).
   * Auth via cookies (withCredentials). Returns created order (201).
   */
  public async createOrder(body: CreateOrderInput): Promise<Order> {
    const url = `${this.path}/order/create`;
    const { data } = await axios.post<Order>(url, body, { withCredentials: true });
    const raw = data as any;
    return raw?.value ?? raw;
  }

  /**
   * Update order status. Backend: POST /order/update, body { orderId, orderStatus }.
   * Customer can only set CANCELLED.
   */
  public async updateOrder(orderId: string, orderStatus: string): Promise<Order> {
    const url = `${this.path}/order/update`;
    const { data } = await axios.post<Order>(url, { orderId, orderStatus }, { withCredentials: true });
    const raw = data as any;
    return raw?.value ?? raw;
  }

  /**
   * Fetch current user's orders. Backend: GET /order/all, ordersController.getMyOrders
   * (page, limit, orderStatus query params) → res.json(result) from database.
   */
  public async getMyOrders(params?: { page?: number; limit?: number; orderStatus?: string }): Promise<Order[]> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const orderStatus = params?.orderStatus;
    let url = `${this.path}/order/all?page=${page}&limit=${limit}`;
    if (orderStatus) url += `&orderStatus=${encodeURIComponent(orderStatus)}`;
    const { data } = await axios.get(url, { withCredentials: true });
    const raw = data as any;
    const list = Array.isArray(raw) ? raw : (raw?.value ?? raw?.orders ?? []);
    const arr = Array.isArray(list) ? list : [];
    return arr.map((o: any) => {
      const orderItemsRaw = o.orderItems ?? [];
      const productData = Array.isArray(o.productData) ? o.productData : [];
      const productMap = new Map<string, { productName?: string; productImages?: string[] }>();
      productData.forEach((p: any) => {
        const id = typeof p._id === "string" ? p._id : p._id?.toString?.();
        if (id) productMap.set(id, { productName: p.productName, productImages: p.productImages });
      });
      const orderItems = orderItemsRaw.map((item: any) => {
        const pid = typeof item.productId === "string" ? item.productId : item.productId?.toString?.() ?? "";
        const prod = productMap.get(pid);
        const img = prod?.productImages?.[0];
        return {
          productId: pid,
          itemQuantity: item.itemQuantity ?? 0,
          itemPrice: item.itemPrice ?? 0,
          productName: prod?.productName ?? item.itemName,
          productImage: img,
        };
      });
      return {
        _id: typeof o._id === "string" ? o._id : o._id?.toString?.() ?? String(o._id),
        userId: typeof o.userId === "string" ? o.userId : o.userId?.toString?.() ?? "",
        status: o.orderStatus ?? o.status ?? "PENDING",
        total: Number(o.orderTotal ?? o.total ?? 0),
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        orderItems,
      };
    });
  }
}

export default OrderService;
