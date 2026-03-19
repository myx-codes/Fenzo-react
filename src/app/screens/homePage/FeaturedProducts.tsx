import React from "react";
import { Container, Box, Typography, Button, IconButton, Rating } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useHistory } from "react-router-dom";

import { retrieveFeaturedProducts } from "./selector";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/cart";
import { WishlistItem } from "../../../lib/types/wishlist";
import { serverApi } from "../../../lib/config";
import { useCart } from "../../context/CartContext";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCreateOrder } from "../../hooks/useCreateOrder";

/** REDUX SELECTOR */
const featuredProductsRetriever = createSelector(
  retrieveFeaturedProducts,
  (featuredProducts) => ({ featuredProducts })
);

export function FeaturedProducts() {
  const history = useHistory();
  const { onAdd: addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistContext();
  const { handleBuyNow, loading: buyNowLoading } = useCreateOrder();
  const { featuredProducts } = useSelector(featuredProductsRetriever);
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  const handleProductCard = (id: string) => history.push(`/products/detail/${id}`);

  return (
    <div className="featured-section">
      <Container>
        <Typography variant="h2" className="section-title">
          Featured Products
        </Typography>

        <div className="products-grid">
          {products.map((product: Product) => {
            const imagePath = product.productImages?.[0]
              ? `${serverApi}/${product.productImages[0]}`
              : "https://via.placeholder.com/300";
            const wishlistItem: WishlistItem = {
              _id: product._id,
              name: product.productName,
              price: product.productPrice,
              image: product.productImages?.[0] ?? "",
              collection: String(product.productCollection),
            };

            return (
              <Box
                key={product._id}
                className="product-card"
                onClick={() => handleProductCard(product._id)}
                sx={{ cursor: "pointer" }}
              >
                <div className="product-image-box">
                  <img
                    src={imagePath}
                    alt={product.productName}
                    className="product-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300";
                    }}
                  />
                  <IconButton
                    className="like-btn"
                    aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(wishlistItem);
                    }}
                    sx={isInWishlist(product._id) ? { color: "red" } : undefined}
                  >
                    {isInWishlist(product._id) ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </div>

                <div className="product-info">
                  <Typography className="product-name">{product.productName}</Typography>

                  <div className="product-meta">
                    <div className="product-rating">
                      <Rating value={product.productViews || 0} precision={0.5} readOnly size="small" />
                      <span className="review-count">
                        ({product.productViews > 10 ? Math.floor(product.productViews / 10) : 0})
                      </span>
                    </div>
                    <Box className="views-box">
                      <VisibilityIcon sx={{ fontSize: 17 }} />
                      <Typography variant="caption">{product.productViews}</Typography>
                    </Box>
                  </div>

                  <Typography className="product-price">${product.productPrice}</Typography>

                  <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outlined"
                      className="btn-cart"
                      onClick={() => {
                        const cartItem: CartItem = {
                          _id: product._id,
                          name: product.productName,
                          price: product.productPrice,
                          quantity: 1,
                          image: product.productImages?.[0] ?? "",
                          collection: String(product.productCollection),
                        };
                        addToCart(cartItem);
                      }}
                    >
                      Add Cart
                    </Button>
                    <Button
                      variant="contained"
                      className="btn-buy"
                      disabled={buyNowLoading}
                      onClick={() => handleBuyNow(product, 1)}
                    >
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