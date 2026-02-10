import { Container } from "@mui/material";
import { useRouteMatch, Switch, Route, Router } from "react-router-dom";
import { Products } from "./Products";
import { ProductCard } from "./ProductCard";

export function ProductsPage() {
  const products = useRouteMatch()
  return <div className="productpage">
     <Switch>
      <Route path= {`${products.path}/:productId`}>
      <ProductCard/>
      </Route>
      <Route path= {`${products.path}`}>
        <Products />
      </Route>
    </Switch>
  </div>;
}