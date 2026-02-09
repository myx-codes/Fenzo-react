import { Container } from "@mui/material";
import { useRouteMatch, Switch, Route, Router } from "react-router-dom";
import { Products } from "./Products";

export function ProductsPage() {
  const products = useRouteMatch()
  return <div className="productpage">
    <Route>
      <Products />
    </Route>
  </div>;
}