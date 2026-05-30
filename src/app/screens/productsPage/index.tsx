import { useRouteMatch, Switch, Route} from "react-router-dom";
import { Products } from "./Products";
import { ProductCard } from "./ProductCard";

export function ProductsPage() {
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