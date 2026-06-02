import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

const heroSlides = [
  {
    id: 2,
    eyebrow: "Limited Season Edit",
    title: "Big Sales ",
    subtitle: "Explore fashion, electronics, beauty, and lifestyle collections with elevated savings.",
    btnKey: "explore",
    image: "/img/sale.jpg",
    path: "/products/FASHION",
  },
] as const;

export default function HomeHero() {
  const { t } = useGlobals();
  const history = useHistory();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <div className="home-hero carousel-container">
      <Box
        className="hero-carousel"
        sx={{
          backgroundImage: `url(${slide.image})`,
        }}
      >
        <Box className="hero-content-wrapper">
          <Typography component="div" className="hero-kicker">
            {slide.eyebrow}
          </Typography>

          <Typography variant="h1" className="hero-title">
            {slide.title}
          </Typography>

          <Typography component="div" className="hero-subtitle">
            {slide.subtitle}
          </Typography>

          <Box className="hero-actions">
            <Button
              variant="contained"
              className="hero-btn"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => history.push(slide.path)}
            >
              {t(slide.btnKey)}
            </Button>
            <Button variant="outlined" className="hero-btn-secondary" onClick={() => history.push("/products/ALL")}>
              View Catalog
            </Button>
          </Box>

          <Box className="hero-metrics" aria-label="Marketplace highlights">
            <span>Verified sellers</span>
            <span>Fast checkout</span>
            <span>Premium brands</span>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
