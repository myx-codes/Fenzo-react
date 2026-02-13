import { Product } from "./product";
import { User } from "./user";

/** REACT APP STATE */
export interface AppRootState{
    homePage: HomePageState;
    productsPage: ProductsPageState;
}

/** HOMEPAGE */
export interface HomePageState{
    featuredProducts: Product[];
    topSellers: User[];
    bestProducts: Product[];
}

/** PRODUCT PAGE */
export interface ProductsPageState{
    store: User [];
    products: Product[];
    productCard: Product | null;
}