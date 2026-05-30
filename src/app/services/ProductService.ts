import axios from "axios";
import { serverApi } from "../../lib/config"
import { Product, ProductInquiry } from "../../lib/types/product";
 class ProductService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }

    public async getProducts(input: ProductInquiry): Promise<Product[]>{
        try{
            let url = `${this.path}/customer/products?order=${input.order}&page=${input.page}&limit=${input.limit}`
            if (input.productCollection) url += `&productCollection=${input.productCollection}`;
            if(input.search) url += `&search=${input.search}`;

            const result = await axios.get(url);
            const data = result.data;
            if (Array.isArray(data)) return data;
            const list = (data as any)?.value?.products ?? (data as any)?.products;
            return Array.isArray(list) ? list : [];

        }catch(err){
            throw err;
        }
    }

    public async aiSearchProducts(input: { query: string; page: number; limit: number }): Promise<Product[]> {
        try {
            const encodedQuery = encodeURIComponent(input.query ?? "");
            const url = `${this.path}/customer/product/ai-search?q=${encodedQuery}&page=${input.page}&limit=${input.limit}`;
            const result = await axios.get(url);
            const data = result.data;
            if (Array.isArray(data)) return data;
            const list = (data as any)?.value?.products ?? (data as any)?.products ?? (data as any)?.value ?? (data as any)?.product;
            return Array.isArray(list) ? list : [];
        } catch (err) {
            throw err;
        }
    }

    /** Fetches all products from the database by requesting every page until none left. */
    public async getAllProducts(opts?: { order?: string; productCollection?: string; search?: string }): Promise<Product[]> {
        const limit = 100;
        const all: Product[] = [];
        let page = 1;
        let chunk: Product[];
        do {
            chunk = await this.getProducts({
                page,
                limit,
                order: opts?.order ?? "createdAt",
                productCollection: opts?.productCollection as any,
                search: opts?.search ?? "",
            });
            all.push(...chunk);
            page++;
        } while (chunk.length === limit);
        return all;
    }


    public async getProduct(productId: string): Promise<Product> {
        if (!productId) {
            throw new Error("Product ID is required");
        }
        const url = `${this.path}/customer/product/detail/${productId}`;
        const result = await axios.get(url, { withCredentials: true });
        const raw = result.data?.value ?? result.data;
        return (raw?.value?.product ?? raw?.value ?? raw) as Product;
      }

 }

 export default ProductService;