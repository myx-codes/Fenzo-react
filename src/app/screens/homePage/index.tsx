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

export function HomePage() {

  useEffect(() => {

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