import React from "react";
import { Container, Box, Typography, Button, IconButton, Rating } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


const products = [
  {
    id: 1,
    name: "Winter Coat Elegant",
    // 60% chegirma: $220 dan $85 ga tushdi
    price: "$85.00",
    oldPrice: "$220.00", 
    discount: "-61%", // Yorliq uchun
    rating: 4.5,
    reviews: 12,
    img: "/img/winter-coat.webp",
  },
  {
    id: 2,
    name: "Casual Denim Jacket",
    // 65% chegirma: $160 dan $55 ga tushdi
    price: "$55.00",
    oldPrice: "$160.00",
    discount: "-65%",
    rating: 4.0,
    reviews: 8,
    img: "/img/jacket.webp",
  },
  {
    id: 3,
    name: "Classic Leather Bag",
    // 60% chegirma: $350 dan $140 ga tushdi
    price: "$140.00",
    oldPrice: "$350.00",
    discount: "-60%",
    rating: 5.0,
    reviews: 25,
    img: "/img/classic-bag.webp",
  },
  {
    id: 4,
    name: "Running Sneakers",
    // 70% chegirma: $320 dan $95 ga tushdi
    price: "$95.00",
    oldPrice: "$320.00",
    discount: "-70%",
    rating: 4.5,
    reviews: 40,
    img: "/img/nike-sneakers.avif",
  }
];

export function BigSales() {
  return (
    <div className="featured-section">
      <Container>
        {/* Sarlavha: Big Sale ekanligi bilinib turishi uchun o'zgartirdim */}
        <Typography variant="h2" className="section-title">
          Big Sales 
        </Typography>

        <div className="products-grid">
          {products.map((product) => (
            <Box key={product.id} className="product-card">
              
              <div className="product-image-box">
                {/* --- YANGI: Foiz yozuvi (Badge) --- */}
                <span className="sale-badge">
                  {product.discount}
                </span>

                <img 
                  src={product.img}
                  alt={product.name} 
                  className="product-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300"; }}
                />
                
                <IconButton className="like-btn" aria-label="add to favorites">
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              </div>

              <div className="product-info">
                <Typography className="product-name">
                  {product.name}
                </Typography>

                <div className="product-rating">
                  <Rating 
                    name="read-only" 
                    value={product.rating} 
                    precision={0.5} 
                    readOnly 
                    size="small" 
                  />
                  <span className="review-count">
                    ({product.reviews})
                  </span>
                </div>
                
                <Typography className="product-price">
                  {product.price}
                  <span className="old-price">{product.oldPrice}</span>
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
          ))}
        </div>
      </Container>
    </div>
  );
}