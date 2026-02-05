import React from "react";
import { Container, Box, Typography, Button, IconButton, Rating } from "@mui/material";
// Iconlar
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


// Static Data (Rating va Reviews qo'shildi)
const products = [
  {
    id: 1,
    name: "Winter Coat Elegant",
    price: "$85.00",
    oldPrice: "$120.00",
    rating: 4.5,
    reviews: 12,
    img: "/img/winter-coat.webp",
  },
  {
    id: 2,
    name: "Casual Denim Jacket",
    price: "$55.00",
    rating: 4.0,
    reviews: 8,
    img: "/img/jacket.webp",
  },
  {
    id: 3,
    name: "Classic Leather Bag",
    price: "$140.00",
    oldPrice: "$180.00",
    rating: 5.0,
    reviews: 25,
    img: "/img/classic-bag.webp",
  },
  {
    id: 4,
    name: "Running Sneakers",
    price: "$95.00",
    rating: 4.5,
    reviews: 40,
    img: "/img/nike-sneakers.avif",
  },
  {
    id: 5,
    name: "Running Sneakers V2",
    price: "$95.00",
    rating: 3.5,
    reviews: 5,
    img: "/img/nike-sneakers.avif",
  },
  {
    id: 6,
    name: "Classic Leather Bag",
    price: "$140.00",
    oldPrice: "$180.00",
    rating: 4.8,
    reviews: 110,
    img: "/img/classic-bag.webp",
  },
  {
    id: 7,
    name: "Winter Coat Elegant",
    price: "$85.00",
    oldPrice: "$120.00",
    rating: 4.2,
    reviews: 18,
    img: "/img/winter-coat.webp",
  },
  {
    id: 8,
    name: "Casual Denim Jacket",
    price: "$55.00",
    rating: 3.0,
    reviews: 2,
    img: "/img/jacket.webp",
  },
   {
    id: 9,
    name: "Winter Coat Elegant",
    price: "$85.00",
    oldPrice: "$120.00",
    rating: 4.5,
    reviews: 12,
    img: "/img/winter-coat.webp",
  },
  {
    id: 10,
    name: "Casual Denim Jacket",
    price: "$55.00",
    rating: 4.0,
    reviews: 8,
    img: "/img/jacket.webp",
  },
  {
    id: 11,
    name: "Classic Leather Bag",
    price: "$140.00",
    oldPrice: "$180.00",
    rating: 5.0,
    reviews: 25,
    img: "/img/classic-bag.webp",
  },
  {
    id: 12,
    name: "Running Sneakers",
    price: "$95.00",
    rating: 4.5,
    reviews: 40,
    img: "/img/nike-sneakers.avif",
  },
];

export function FeaturedProducts() {
  return (
    <div className="featured-section">
      <Container>
        {/* Sarlavha */}
        <Typography variant="h2" className="section-title">
          Featured Products
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

                {/* --- YANGI: Rating va Izohlar --- */}
                <div className="product-rating">
                  <Rating 
                    name="read-only" 
                    value={product.rating} 
                    precision={0.5} // Yarim yulduzlar uchun (4.5)
                    readOnly // O'zgartirib bo'lmaydigan qilish uchun
                    size="small" 
                  />
                  <span className="review-count">
                    ({product.reviews})
                  </span>
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