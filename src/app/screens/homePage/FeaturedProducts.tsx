import React from "react";
import { Container, Box, Typography, Button, IconButton, Rating, Stack } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility'; 

// Redux va Config importlari
import { retrieveFeaturedProducts } from "./selector";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config"; // 

/** REDUX SELECTOR */
const featuredProductsRetriever = createSelector(
  retrieveFeaturedProducts,
  (featuredProducts) => ({ featuredProducts })
);

export function FeaturedProducts() {
  // 1. Reduxdan ma'lumotni olamiz
  const { featuredProducts } = useSelector(featuredProductsRetriever);
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <div className="featured-section">
      <Container>
        <Typography variant="h2" className="section-title">
          Featured Products
        </Typography>

        <div className="products-grid">
          {products.map((product: Product) => {
            const imagePath = `${serverApi}/${product.productImages[0]}` 
        
            return (
              <Box key={product._id} className="product-card">
                
                {/* Rasm qismi */}
                <div className="product-image-box">
                  <img 
                    src={imagePath}
                    alt={product.productName} 
                    className="product-img"
                    // Agar rasm manzili xato bo'lsa, buzilgan rasm iconi chiqmasligi uchun:
                    onError={(e) => { 
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300"; 
                    }}
                  />
                  
                  <IconButton className="like-btn" aria-label="add to favorites">
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                </div>

                {/* Ma'lumot qismi */}
                <div className="product-info">
                  <Typography className="product-name">
                    {product.productName}
                  </Typography>

                  <div className="product-meta">
                    {/* Rating */}
                    <div className="product-rating">
                      <Rating 
                        name="read-only" 
                        value={product.productRating ? product.productRating : 0} 
                        precision={0.5} 
                        readOnly 
                        size="small" 
                      />
                      <span className="review-count">
                        ({product.productViews})
                      </span>
                    </div>

                    {/* Views */}
                    <div className="product-views">
                      <VisibilityIcon />
                      <Typography variant="caption">
                        {product.productViews}
                      </Typography>
                    </div>
                  </div>
                  
                  <Typography className="product-price">
                    ${product.productPrice}
                  </Typography>

                  <div className="action-buttons">
                    <Button variant="outlined" className="btn-cart">
                      Add Cart
                    </Button>
                    <Button variant="contained" className="btn-buy">
                      Buy Now
                    </Button>
                  </div>
                </div>

              </Box>
            );
          })}
        </div>
      </Container>
    </div>
  );
}