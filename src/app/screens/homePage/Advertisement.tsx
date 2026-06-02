import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

const videoSrc = `/video/apple-watch-h264.mp4`;

export default function Advertisement() {
  const history = useHistory();

  return (
    <div className="ad-section">
      <video className="ad-video" autoPlay loop muted playsInline>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="ad-overlay" />

      <Box className="ad-content">
        <span className="ad-eyebrow">Curated Collection</span>
        <Typography variant="h1" className="ad-title">
          Smart Luxury<br />Edit
        </Typography>
        <Typography className="ad-subtitle">
          Signature devices, refined accessories, and daily
          essentials selected for a cleaner shopping experience.
        </Typography>
        <Box className="ad-actions">
          <Button
            className="ad-btn-primary"
            onClick={() => history.push("/products/ELECTRONICS")}
          >
            Discover Electronics
          </Button>
          <Button
            className="ad-btn-ghost"
            onClick={() => history.push("/products/ALL")}
          >
            View All Products
          </Button>
        </Box>
      </Box>
    </div>
  );
}