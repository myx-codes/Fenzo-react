import { useRouteMatch, Switch, Route} from "react-router-dom";
import { Products } from "./Products";
import { useDispatch} from "react-redux";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { setProductCard, setProducts } from "./slice";
import { useEffect } from "react";
import { ProductCard } from "./ProductCard";

export function ProductsPage() {

  const dispatch = useDispatch();
  useEffect(() => {
    const productService = new ProductService();
    productService
      .getAllProducts({ order: "createdAt" })
      .then((data: Product[]) => {
        dispatch(setProducts(data));
        dispatch(setProductCard(data));
      })
      .catch((err) => console.error(err));
  }, [dispatch])
  

  const products = useRouteMatch()
  return <div className="productpage">
     <Switch>
      <Route path= {`${products.path}/detail/:productId`}>
      <ProductCard/>
      </Route>
      <Route path= {`${products.path}/:collection`}>
        <Products />
      </Route>
    </Switch>
  </div>;
}