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
import { createSelector } from "@reduxjs/toolkit";
import { setFeaturedProducts } from "./slice";
import { retrieveFeaturedProducts} from "./selector"
import { Product } from "../../../../lib/types/product";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setFeaturedProducts: (data: Product[]) => dispatch(setFeaturedProducts(data)),
});
const featuredProductsRetrieve = createSelector(
  retrieveFeaturedProducts,
  (featuredProducts) => ({featuredProducts})
);

export function HomePage() {
  const { setFeaturedProducts} = actionDispatch(useDispatch());
  const {featuredProducts} = useSelector(featuredProductsRetrieve)
  // selector: store => data
  
  useEffect(() => {}, [])



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