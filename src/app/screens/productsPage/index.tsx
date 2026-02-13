import { Container } from "@mui/material";
import { useRouteMatch, Switch, Route, Router } from "react-router-dom";
import { Products } from "./Products";


import { useDispatch} from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { setProductCard, setProducts, setStore } from "./slice";
import { useEffect } from "react";

import { User } from "src/lib/types/user";
import UserService from "src/app/services/UserService";
import { setTopSellers } from "../homePage/slice";
import { ProductCard } from "./ProductCard";


/** REDUX SLICE */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
  setProductCard: (data: Product[]) => dispatch(setProductCard(data)),
  setStore: (data: User) => dispatch(setStore(data)),
});

export function ProductsPage() {

  const { setProducts, setProductCard } = actionDispatch(useDispatch());
  useEffect(() => {
    const products = new ProductService();
    products.getProducts({
      page: 1,
      limit: 22,
      order: "createdAt",
      search:""
    }).then((data) => {setProducts(data)}).catch((err) => console.log(err))


    const product = new ProductService();
    product.getProducts({
      page:1,
      limit:22
    }).then((data) => {setProductCard(data)}).catch((err) => console.log(err))

  }, [])
  

  const products = useRouteMatch()
  return <div className="productpage">
     <Switch>
      <Route path= {`${products.path}/detail/:productId`}>
      <ProductCard/>
      </Route>
      <Route path= {`${products.path}`}>
        <Products />
      </Route>
    </Switch>
  </div>;
}