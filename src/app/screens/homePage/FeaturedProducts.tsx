import React from "react";
import { Container, Box, Typography, Button, IconButton, Rating, Stack } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility'; 

// Redux va Config importlari
import { retrieveFeaturedProducts } from "./selector";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config"; // 👈 serverApi (http://localhost:3001) shart!

/** REDUX SELECTOR */
const featuredProductsRetriever = createSelector(
  retrieveFeaturedProducts,
  (featuredProducts) => ({ featuredProducts })
);

export function FeaturedProducts() {
  // 1. Reduxdan ma'lumotni olamiz
  const { featuredProducts } = useSelector(featuredProductsRetriever);

  /** * 2. XAVFSIZLIK TEKSHIRUVI (Fix for "map is not a function")
   * Agar featuredProducts hali kelmagan bo'lsa (null/undefined), bo'sh array olamiz.
   */
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <div className="featured-section">
      <Container>
        <Typography variant="h2" className="section-title">
          Featured Products
        </Typography>

        <div className="products-grid">
          {products.map((product: Product) => {
            
            /** * 3. RASM YO'LINI YASASH (Fix for images not showing)
             * Backenddan rasm nomi keladi: "uploads/products/image.jpg"
             * Biz unga server manzilini ulaymiz: "http://localhost:3001/uploads/..."
             */
            const imagePath = product.productImages && product.productImages.length > 0 
              ? `${serverApi}/${product.productImages[0]}` 
              : "/icons/default-product.png"; // Rasm yo'q bo'lsa zaxira rasm

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

                  <div className="product-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    
                    {/* Rating */}
                    <div className="product-rating" style={{ display: 'flex', alignItems: 'center' }}>
                      <Rating 
                        name="read-only" 
                        value={product.productRating ? product.productRating : 0} 
                        precision={0.5} 
                        readOnly 
                        size="small" 
                      />
                      <span className="review-count" style={{ marginLeft: '4px', fontSize: '12px', color: '#777' }}>
                        ({product.productViews})
                      </span>
                    </div>

                    {/* Views */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#555' }}>
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {product.productViews}
                        </Typography>
                    </Box>

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