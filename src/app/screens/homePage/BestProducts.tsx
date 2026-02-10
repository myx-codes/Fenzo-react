import React from "react";
import { Container, Box, Typography, Button, IconButton, Rating, Stack } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility'; 

// MOCK DATA (views qo'shildi)
const products = [
  {
    id: 1,
    name: "Winter Coat Elegant",
    price: "$85.00",
    oldPrice: "$120.00",
    rating: 4.5,
    reviews: 12,
    views: 1240, // <--- YANGI
    img: "/img/winter-coat.webp",
  },
  {
    id: 2,
    name: "Casual Denim Jacket",
    price: "$55.00",
    rating: 4.0,
    reviews: 8,
    views: 850, // <--- YANGI
    img: "/img/jacket.webp",
  },
  {
    id: 3,
    name: "Classic Leather Bag",
    price: "$140.00",
    oldPrice: "$180.00",
    rating: 5.0,
    reviews: 25,
    views: 3200, // <--- YANGI
    img: "/img/classic-bag.webp",
  },
  {
    id: 4,
    name: "Running Sneakers",
    price: "$95.00",
    rating: 4.5,
    reviews: 40,
    views: 560, 
    img: "/img/nike-sneakers.avif",
  },
  {
    id: 5,
    name: "Running Sneakers V2",
    price: "$95.00",
    rating: 3.5,
    reviews: 5,
    views: 120,
    img: "/img/nike-sneakers.avif",
  },
  {
    id: 6,
    name: "Classic Leather Bag",
    price: "$140.00",
    oldPrice: "$180.00",
    rating: 4.8,
    reviews: 110,
    views: 5000,
    img: "/img/classic-bag.webp",
  },
];

export function BestProducts() {
  return (
    <div className="featured-section">
      <Container>
        {/* Sarlavha */}
        <Typography variant="h2" className="section-title">
          Popular Products
        </Typography>

        {/* Grid */}
        <div className="products-grid">
          {products.map((product) => (
            <Box key={product.id} className="product-card">
              
              {/* Rasm qismi */}
              <div className="product-image-box">
                <img 
                  src={product.img}
                  alt={product.name} 
                  className="product-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300"; }}
                />
                
                {/* Like Tugmasi */}
                <IconButton className="like-btn" aria-label="add to favorites">
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              </div>

              {/* Ma'lumot qismi */}
              <div className="product-info">
                <Typography className="product-name">
                  {product.name}
                </Typography>

                {/* --- RATING, REVIEWS VA VIEWS --- */}
                <div className="product-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  
                  {/* Rating qismi */}
                  <div className="product-rating" style={{ display: 'flex', alignItems: 'center' }}>
                    <Rating 
                      name="read-only" 
                      value={product.rating} 
                      precision={0.5} 
                      readOnly 
                      size="small" 
                    />
                    <span className="review-count" style={{ marginLeft: '4px', fontSize: '12px', color: '#777' }}>
                      ({product.reviews})
                    </span>
                  </div>

                  {/* --- VIEWS  --- */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'dark-blue' }}>
                      <VisibilityIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {product.views}
                      </Typography>
                  </Box>

                </div>
                
                <Typography className="product-price">
                  {product.price}
                  {product.oldPrice && (
                    <span className="old-price">{product.oldPrice}</span>
                  )}
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
          ))}
        </div>
      </Container>
    </div>
  );
}