import axios from "axios";
import { serverApi } from "../../lib/config";
import { User, UserInput, LoginInput, UserUpdateInput } from "../../lib/types/user";

export interface AuthResponse {
    user: User;
    accessToken: string;
}

class UserService {
    private readonly path: string;

    constructor(){
        this.path = serverApi;
    }

    /** Login: returns user + accessToken. Store token in cookies. */
    public async login(input: LoginInput): Promise<AuthResponse> {
        const url = `${this.path}/auth/login`;
        const { data } = await axios.post<AuthResponse>(url, input);
        const raw = data as any;
        const value = raw?.value ?? raw;
        return {
            user: value.user ?? raw.user,
            accessToken: value.accessToken ?? raw.accessToken,
        };
    }

    /** Signup: register new member, returns user + accessToken. */
    public async signup(input: UserInput): Promise<AuthResponse> {
        const url = `${this.path}/auth/signup`;
        const { data } = await axios.post<AuthResponse>(url, input);
        const raw = data as any;
        const value = raw?.value ?? raw;
        return {
            user: value.user ?? raw.user,
            accessToken: value.accessToken ?? raw.accessToken,
        };
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
            const url = `${this.path}/member/${memberId}`;
            const result = await axios.get(url);
            const data = result.data as any;
            return data?.value ?? data;
        } catch (err) {
            throw err;
        }
    }

    /** Update current member profile (requires auth). */
    public async updateMember(memberId: string, input: UserUpdateInput): Promise<User> {
        const url = `${this.path}/member/${memberId}`;
        const { data } = await axios.patch(url, input);
        const raw = data as any;
        return raw?.value ?? raw?.user ?? raw;
    }
}

export default UserService