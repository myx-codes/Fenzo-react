import React, { useState } from "react";
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Button, 
  Rating, 
  Stack, 
  Chip, 
  Divider,
  IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from "react-router-dom"; 

// MOCK DATA
const product = {
  id: 1,
  name: "Premium Wireless Headphones Pro",
  price: 120.00,
  oldPrice: 150.00,
  sku: "WH-1000XM5",
  rating: 4.8,
  reviews: 124,
  description: "Experience world-class noise cancellation and superior sound quality. These headphones are designed for comfort and long-lasting battery life, making them perfect for travel and daily use.",
  category: "Electronics",
  colors: ["#000000", "#FFFFFF", "#1976d2"],
  images: [
    "/img/nike-sneakers.avif", 
    "/img/winter-coat.webp",    
    "/img/jacket.webp",     
  ]
};

export function ProductCard() {
  const history = useHistory();
  
  // STATE
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  // HANDLERS
  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity(prev => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="single-product-page">
      <Container>
        
        {/* Back Button */}
        <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => history.goBack()} 
            className="back-btn"
        >
            Back to products
        </Button>

        <Grid container spacing={5}>
          
          {/* --- CHAP TOMON: RASMLAR --- */}
          {/* DIQQAT: Grid size={} emas, Grid item xs={} ishlatildi */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="main-image-wrapper">
               <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="product-main-img"
               />
            </div>
            
            {/* Thumbnails */}
            <Stack direction="row" spacing={2} justifyContent="center">
              {product.images.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`thumbnail-box ${activeImage === img ? 'active' : ''}`}
                >
                  <img src={img} alt="thumb" />
                </div>
              ))}
            </Stack>
          </Grid>

          {/* --- O'NG TOMON: MA'LUMOTLAR --- */}
          <Grid size={{ xs: 12, md: 6 }}>
            
            {/* Category & Status */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Chip label={product.category} color="primary" variant="outlined" size="small" />
                <Typography variant="caption" color="green" sx={{ fontWeight: 'bold' }}>
                    In Stock
                </Typography>
            </Stack>

            {/* Title */}
            <Typography variant="h3" className="product-title" sx={{ mt: 2, mb: 1 }}>
              {product.name}
            </Typography>

            {/* Rating */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({product.reviews} reviews)
              </Typography>
            </Stack>

            {/* Price */}
            <div className="price-box">
               <Typography variant="h4" className="current-price">
                 ${product.price.toFixed(2)}
               </Typography>
               {product.oldPrice && (
                 <Typography variant="h6" className="old-price">
                   ${product.oldPrice.toFixed(2)}
                 </Typography>
               )}
            </div>

            <Divider sx={{ mb: 3 }} />

            {/* Description */}
            <Typography variant="body1" className="product-desc">
              {product.description}
            </Typography>

            {/* Color Selector */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    Color:
                </Typography>
                <Stack direction="row" spacing={2}>
                    {product.colors.map((color) => (
                        <div
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Actions */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                
                {/* Quantity */}
                <Box className="quantity-control">
                    <IconButton onClick={() => handleQuantity("dec")} disabled={quantity <= 1}>
                        <RemoveIcon />
                    </IconButton>
                    <span className="quantity-text">{quantity}</span>
                    <IconButton onClick={() => handleQuantity("inc")}>
                        <AddIcon />
                    </IconButton>
                </Box>

                {/* Add to Cart */}
                <Button 
                    variant="contained" 
                    startIcon={<ShoppingCartIcon />}
                    className="btn-add-cart"
                    fullWidth={false}
                    sx={{ flexGrow: 1 }}
                >
                    Add to Cart
                </Button>

                {/* Wishlist */}
                <IconButton className="btn-fav" color="primary">
                    <FavoriteBorderIcon />
                </IconButton>

            </Stack>
            
            <Box sx={{ mt: 4 }}>
                <Typography variant="caption" color="text.secondary">
                    SKU: {product.sku} <br/>
                    Category: {product.category}
                </Typography>
            </Box>

          </Grid>
        </Grid>
      </Container>
    </div>
  );
}