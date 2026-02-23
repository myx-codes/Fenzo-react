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
            // Normalize: API may return array or wrapped (e.g. { value: { sellers } } or { sellers })
            if (Array.isArray(data)) return data;
            const list = (data as any)?.value?.sellers ?? (data as any)?.sellers ?? (data as any)?.value?.data ?? (data as any)?.data;
            return Array.isArray(list) ? list : [];

        }catch(err){
            throw err;
        }
    }

    public async getMember(memberId: string): Promise<User> {
    try {
        let url = `${this.path}/member/${memberId}`; // Agar backenda shunday yo'l bo'lsa
        const result = await axios.get(url);
        return result.data;
    } catch(err) {
        throw err;
    }
}
}

export default UserService