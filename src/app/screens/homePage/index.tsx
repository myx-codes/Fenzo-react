import Statistics from "./Statistics";
import { FeaturedProducts } from "./FeaturedProducts";
import { TopBrands} from "./TopBrands";
import Advertisement from "./Advertisement";
import { TopSellers } from "./TopSellers";
import { BigSales } from "./BigSales";
import React , { useEffect } from "react";
import { BestProducts } from "./BestProducts";

import { useDispatch} from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setBestProducts, setFeaturedProducts, setTopSellers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import UserService from "../../services/UserService";
import { User } from "../../../lib/types/user";

/** REDUX SLICE */
const actionDispatch = (dispatch: Dispatch) => ({
  setFeaturedProducts: (data: Product[]) => dispatch(setFeaturedProducts(data)),
  setBestProducts: (data: Product[]) => dispatch(setBestProducts(data)),
  setTopSellers: (data: User[]) => dispatch(setTopSellers(data))
});


export default function HomePage() {
  const { setFeaturedProducts, setBestProducts, setTopSellers } = actionDispatch(useDispatch());
  

  // selector: store => data
  
  useEffect(() => {
    // backend server data fetch => data
    const product = new ProductService();
    product.getProducts({
      page:1,
      limit:12,
      order: "createdAt",
    })
    .then((data) => {setFeaturedProducts(data);})
    .catch((err) => console.log("error", err));

    product.getProducts({
    page:1,
    limit:12,
    order: "productViews",
    })
    .then((data) => {setBestProducts(data);})
    .catch((err) => console.log("error", err))

    const user = new UserService();
    user
    .getTopSellers()
    .then((data) => {setTopSellers(data)})
    .catch((err) => console.log(err))

  }, [])



  return <div className="homepage">
    <Statistics/>
    <FeaturedProducts/>
    <BestProducts />
    <TopBrands/>
    <Advertisement/>
    <TopSellers/>
    <BigSales/>
  </div>;
}