import React, { useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Rating, 
  Tab, 
  Tabs 
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';


// MOCK DATA (Yangi dizaynga mos: reviews, oldPrice bor)
const productsData = [
  { id: 1, name: "Wireless Headset Pro", category: "Electronics", price: "$120.00", oldPrice: "$150.00", rating: 4.5, reviews: 34, img: "/img/nike-sneakers.avif"},
  { id: 2, name: "Men's Casual Jacket", category: "Fashion", price: "$85.00", rating: 5.0, reviews: 12, img: "/img/winter-coat.webp" },
  { id: 3, name: "Smart Watch Series 7", category: "Electronics", price: "$299.00", oldPrice: "$350.00", rating: 4.0, reviews: 88, img: "/img/winter-coat.webp"},
  { id: 4, name: "Running Sneakers", category: "Fashion", price: "$95.00", rating: 4.5, reviews: 56, img: "/img/classic-bag.webp"},
  { id: 5, name: "Leather Bag", category: "Fashion", price: "$150.00", oldPrice: "$200.00", rating: 5.0, reviews: 21, img: "/img/nike-sneakers.avif"},
  { id: 6, name: "Gaming Mouse", category: "Electronics", price: "$45.00", rating: 4.2, reviews: 105, img: "/img/classic-bag.webp"},
  { id: 7, name: "Digital Camera 4K", category: "Electronics", price: "$650.00", rating: 5.0, reviews: 9, img: "/img/classic-bag.webp"},
  { id: 8, name: "Modern Sofa", category: "Home", price: "$450.00", oldPrice: "$600.00", rating: 4.6, reviews: 15, img: "/img/jacket.webp"},
];

export function Products() {
  const [tabValue, setTabValue] = useState("All");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // Kategoriya bo'yicha saralash logikasi
  const filteredProducts = tabValue === "All" 
    ? productsData 
    : productsData.filter(item => item.category === tabValue);

  return (
    <div className="products-section"> {/* FeaturedProducts dagi container klassi bilan bir xil uslubda */}
      <Container>
        {/* --- GRID (Bir xil tuzilish) --- */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              
              {/* Rasm qismi */}
              <div className="product-image-box">
                <img 
                  src={product.img}
                  alt={product.name} 
                  className="product-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Fenzo+Product" }}
                />
                
                {/* Like Tugmasi */}
                <IconButton className="like-btn" aria-label="add to favorites">
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              </div>

              {/* Ma'lumot qismi */}
              <div className="product-info">
                <Typography className="product-name" title={product.name}>
                  {product.name}
                </Typography>

                {/* Rating va Izohlar */}
                <div className="product-rating">
                  <Rating 
                    value={product.rating} 
                    precision={0.5} 
                    readOnly 
                    size="small" 
                  />
                  <span className="review-count">
                    ({product.reviews} reviews)
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
                  <Button variant="outlined" className="btn-cart" startIcon={<ShoppingCartOutlinedIcon />}>
                    Add Cart
                  </Button>
                  <Button variant="contained" className="btn-buy">
                    Buy Now
                  </Button>
                </div>
              </div>

            </div>
          ))}
        </div>
        
        {/* Load More Tugmasi */}
        <Box className="load-more-conteiner">
             <Button variant="outlined" className="load-more-btn">
                Load More
             </Button>
        </Box>

      </Container>
    </div>
  );
}