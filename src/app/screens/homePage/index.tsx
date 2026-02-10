import { Container } from "@mui/material";
import Statistics from "./Statistics";
import { FeaturedProducts } from "./FeaturedProducts";
import { TopBrands} from "./TopBrands";
import Advertisement from "./Advertisement";
import { TopSellers } from "./TopSellers";
import { BigSales } from "./BigSales";
import { WelcomeAuthModal } from "./WelcomeAuthModal";
import { useEffect } from "react";
import { BestProducts } from "./BestProducts";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setFeaturedProducts } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enums";

/** REDUX SLICE */
const actionDispatch = (dispatch: Dispatch) => ({
  setFeaturedProducts: (data: Product[]) => dispatch(setFeaturedProducts(data)),
});


export function HomePage() {
  const { setFeaturedProducts} = actionDispatch(useDispatch());
  // selector: store => data
  
  useEffect(() => {
    // backend server data fetch => data
    const product = new ProductService();
    product.getProducts({
      page:1,
      limit:4,
      order: "productViews",
      productCollection: ProductCollection.ELECTRONICS
    })
    .then((data) => {
      setFeaturedProducts(data);
    })
    .catch((err) => console.log("error", err))
  }, [])



  return <div className="homepage">
    <Statistics/>
    <FeaturedProducts/>
    <BestProducts />
    <TopBrands/>
    <Advertisement/>
    <TopSellers/>
    <BigSales/>
    <WelcomeAuthModal/>
  </div>;
}