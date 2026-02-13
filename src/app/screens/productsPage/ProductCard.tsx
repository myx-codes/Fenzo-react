import React, { useState, useEffect } from "react";
import { 
  Container, Grid, Box, Typography, Button, Rating, Stack, Chip, Divider, IconButton, CircularProgress, Breadcrumbs, Link 
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HomeIcon from '@mui/icons-material/Home';

import { useHistory, useParams } from "react-router-dom"; 
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveProducts } from "./selector"; 
import { Product } from "../../../lib/types/product"; 
import { serverApi } from "../../../lib/config";
import ProductService from "../../services/ProductService"; 



// Selector
const ProductsRetriever = createSelector(
  retrieveProducts,
  (products) => ({ products })
);

export function ProductCard() {
  const history = useHistory();
  const { productId } = useParams<{ productId: string }>();
  const { products } = useSelector(ProductsRetriever);
  const chosenProduct = products?.find((p: Product) => p._id === productId);

  const [product, setProduct] = useState<Product | null>(chosenProduct || null);
  const [loading, setLoading] = useState(!chosenProduct);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productService = new ProductService();
    const formatImage = (img?: string) => img ? `${serverApi}/${img}` : "/img/placeholder.jpg";

    if (chosenProduct) {
        setProduct(chosenProduct);
        setActiveImage(formatImage(chosenProduct.productImages?.[0]));
        productService.getProduct(productId)
            .then(data => setProduct(data))
            .catch(err => console.log("Background update error:", err));
    } else {
        setLoading(true);
        productService.getProduct(productId)
            .then((data) => {
                setProduct(data);
                setActiveImage(formatImage(data.productImages?.[0]));
            })
            .catch((err) => console.log("Fetch error:", err))
            .finally(() => setLoading(false));
    }
  }, [productId, chosenProduct]);

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity(prev => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
  };

  if (loading) {
     return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
         <CircularProgress size={50} thickness={4} sx={{ color: '#1976d2' }} />
       </Box>
     );
  }

  if (!product) {
      return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Product not found!</Typography>
            <Button onClick={() => history.push("/products")} variant="contained">Back to Store</Button>
        </Container>
      );
  }

  return (
    <div className="single-product-page compact">
      <Container maxWidth="lg" className="product-container">

        {/* Top Bar */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" className="top-bar">
            <Button startIcon={<ArrowBackIcon />} onClick={() => history.push("/products")} className="back-btn">
                Back to products
            </Button>

            <Breadcrumbs separator="›">
                <Link onClick={() => history.push("/")} className="breadcrumb-link"><HomeIcon fontSize="small"/> Home</Link>
                <Link onClick={() => history.push("/products")} className="breadcrumb-link">Products</Link>
                <Typography className="breadcrumb-current">{product.productName}</Typography>
            </Breadcrumbs>
        </Stack>

        <Grid container spacing={4}>

          {/* LEFT IMAGE */}
          <Grid size={{xs:12, md:6}}>
            <div className="image-section">
              <div className="main-image-wrapper">
                <img src={activeImage} alt={product.productName} className="product-main-img"/>
                <Chip label={product.productCollection} className="collection-chip"/>
              </div>

              <Stack direction="row" spacing={1} className="thumbnail-row">
                {product.productImages?.map((img, index) => {
                  const imgUrl = `${serverApi}/${img}`;
                  return (
                    <div key={index} onClick={() => setActiveImage(imgUrl)} className={`thumbnail-box ${activeImage === imgUrl ? "active" : ""}`}>
                      <img src={imgUrl} alt="thumb"/>
                    </div>
                  )
                })}
              </Stack>
            </div>
          </Grid>

          {/* RIGHT DETAILS */}
          <Grid size={{xs:12, md:6}}>
            <div className="details-section">

              {/* Product Name */}
              <Typography className="product-title">{product.productName}</Typography>

              {/* User Info */}
              {/* {seller && (
              <Stack direction="row" alignItems="center" spacing={1} className="user-info">
                <img 
                  src={`${serverApi}/${seller.userImage}`} 
                  alt="user" 
                  className="user-avatar"
                />
                <Typography className="username">
                  {seller.userNick}
                </Typography>
              </Stack>
            )} */}


              {/* Rating & Views */}
              <div className="rating-row">
                <Rating value={4.5} readOnly precision={0.5} size="small"/>
                <span>(4.5 Review)</span>
                <div className="views"><VisibilityIcon fontSize="small"/>{product.productViews} views</div>
              </div>

              {/* Price */}
              <div className="price">${product.productPrice.toLocaleString()}</div>

              {/* Description */}
              <p className="description">{product.productDesc || "High-quality and durable product for everyday use."}</p>

              {/* Quantity */}
              <div className="quantity-row">
                <span>Quantity:</span>
                <div className="quantity-box">
                  <IconButton onClick={() => handleQuantity("dec")} disabled={quantity <= 1} size="small"><RemoveIcon/></IconButton>
                  <span>{quantity}</span>
                  <IconButton onClick={() => handleQuantity("inc")} size="small"><AddIcon/></IconButton>
                </div>
              </div>

              {/* Buttons */}
              <div className="button-row">
                <Button variant="contained" startIcon={<ShoppingCartIcon/>} className="cart-btn">Add to Cart</Button>
                <Button variant="outlined" startIcon={<FavoriteBorderIcon/>} className="save-btn">Save</Button>
              </div>

              {/* Info Box */}
              <div className="info-box">
                <div><small>Brand</small><strong>Fenzo Official</strong></div>
                <div><small>Category</small><strong>{product.productCollection}</strong></div>
              </div>

            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
