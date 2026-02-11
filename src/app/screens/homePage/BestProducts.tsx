import React from "react";
import { Container, Box, Typography, Button, IconButton, Rating } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility'; 

// Redux va Config importlari
// 1. Selectorlarni to'g'ri import qilamiz
import { retrieveBestProducts } from "./selector"; 
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config"; 

/** REDUX SELECTOR */
// Selector faylidan kelgan funksiyani o'rab olamiz
const bestProductsRetriever = createSelector(
  retrieveBestProducts,
  (bestProducts) => ({ bestProducts })
);

export function BestProducts() {
  // 2. Reduxdan ma'lumotni olamiz
  const { bestProducts } = useSelector(bestProductsRetriever);
  
  // 3. Xavfsizlik uchun tekshiruv (null kelsa bo'sh array)
  const products = Array.isArray(bestProducts) ? bestProducts : [];

  return (
    <div className="featured-section">
      <Container>
        <Typography variant="h2" className="section-title">
          Popular Products
        </Typography>

        <div className="products-grid">
          {/* 4. MAP FUNKSIYASINI TO'G'IRLASH */}
          {products.map((product: Product) => {
             // Jingalak qavs { ochildi, endi o'zgaruvchi yozsa bo'ladi
             
             const imagePath = product.productImages && product.productImages.length > 0
               ? `${serverApi}/${product.productImages[0]}`
               : "https://via.placeholder.com/300";

             // Endi esa 'return' so'zi orqali JSX qaytaramiz
             return (
                <Box key={product._id} className="product-card">
                  {/* Rasm qismi */}
                  <div className="product-image-box">
                    <img 
                      src={imagePath}
                      alt={product.productName} 
                      className="product-img"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300"; }}
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
                          <Rating value={product.productViews || 0} precision={0.5} readOnly size="small" />
                          <span className="review-count">({product.productViews > 10 ? Math.floor(product.productViews / 10) : 0})</span>
                      </div>

                      {/* Views */}
                      <Box className="product-views">
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {product.productViews}
                          </Typography>
                      </Box>
                    </div>
                    
                    <Typography className="product-price">
                      ${product.productPrice}
                      {/* Mantiq: Agar eski narx bo'lsa ko'rsatish kerak (hozircha shartli qo'ydim) */}
                      {/* <span className="old-price">${product.productPrice + 10}</span> */}
                    </Typography>

                    {/* Tugmalar */}
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