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


    public async getProduct(productId: string): Promise<Product>{
    try{
      const url = `${this.path}/product/detail/${productId}`
      const result = await axios.get(url, {withCredentials: true});
      return result.data;
    }catch(err) {
      throw(err)
    }
  }






 }

 export default ProductService;