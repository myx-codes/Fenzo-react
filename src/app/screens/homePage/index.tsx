import { Container } from "@mui/material";
import Statistics from "./Statistics";
import { FeaturedProducts } from "./FeaturedProducts";

export function HomePage() {
  return <div className="homepage">
    <Statistics/>
    <FeaturedProducts/>
  </div>;
}