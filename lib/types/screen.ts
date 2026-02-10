import { Product } from "./product";
import { User } from "./user";

/** REACT APP STATE */
export interface AppRootState{
    homePage: HomePageState;
}

/** HOMEPAGE */
export interface HomePageState{
    featuredProducts: Product[];
    topSellers: User[];
    bigSales: Product[];
}

/** PRODUCT PAGE */