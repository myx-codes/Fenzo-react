import { Container } from "@mui/material";
import { useRouteMatch, Switch, Route, Router } from "react-router-dom";
import { Products } from "./Products";
import { ProductCard } from "./ProductCard";

import { useDispatch} from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { setProductCard, setProducts } from "./slice";
import { useEffect } from "react";

/** REDUX SLICE */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
  setProductCard: (data: Product[]) => dispatch(setProductCard(data)),
});

export function ProductsPage() {

  const { setProducts, setProductCard } = actionDispatch(useDispatch());
  useEffect(() => {
    const products = new ProductService();
    products.getProducts({
      page: 1,
      limit: 19,
      order: "createdAt",
      search:""
    }).then((data) => {setProducts(data)}).catch((err) => console.log(err))
  }, [])

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