import { Container } from "@mui/material";
import Statistics from "./Statistics";
import { FeaturedProducts } from "./FeaturedProducts";
import { TopBrands} from "./TopBrands";
import Advertisement from "./Advertisement";
import { TopSellers } from "./TopSellers";
import { BigSales } from "./BigSales";
import { WelcomeAuthModal } from "./WelcomeAuthModal";

export function HomePage() {
  return <div className="homepage">
    <Statistics/>
    <FeaturedProducts/>
    <TopBrands/>
    <Advertisement/>
    <TopSellers/>
    <BigSales/>
    <WelcomeAuthModal/>
  </div>;
}