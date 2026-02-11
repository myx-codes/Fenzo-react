import axios from "axios";
import { serverApi } from "../../lib/config";
import { User, UserInput } from "../../lib/types/user";

class UserService {
    private readonly path: string;

    constructor(){
        this.path = serverApi;
    }

    public async getTopSellers(): Promise<User[]>{
        try{

            let url = `${this.path}/customer/sellers`
            const result = await axios.get(url);
            const data = result.data;
            // Normalize: API may return array or wrapped (e.g. { value: { products } } or { products })
            if (Array.isArray(data)) return data;
            const list = (data as any)?.value?.products ?? (data as any)?.products;
            return Array.isArray(list) ? list : [];

        }catch(err){
            console.log("Error getProducts", err);
            throw err;
        }
    }
}

export default UserService