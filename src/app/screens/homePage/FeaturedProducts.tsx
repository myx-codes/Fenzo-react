import React from "react";
import {
  Container, Box, Typography, Button, IconButton, Rating, Tooltip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import { useHistory } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { retrieveFeaturedProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/cart";
import { WishlistItem } from "../../../lib/types/wishlist";
import { serverApi } from "../../../lib/config";
import { useCart } from "../../context/CartContext";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCreateOrder } from "../../hooks/useCreateOrder";

const featuredRetriever = createSelector(
  retrieveFeaturedProducts,
  (featuredProducts) => ({ featuredProducts })
);

export function FeaturedProducts() {
  const history = useHistory();
  const { onAdd: addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistContext();
  const { handleBuyNow, loading: buyNowLoading } = useCreateOrder();
  const { featuredProducts } = useSelector(featuredRetriever);
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <div className="lp-products-section">
      <Container maxWidth="xl">
        <div className="lp-section-head">
          <div>
            <Typography className="lp-section-title">Featured Products</Typography>
          </div>
          <Button
            className="lp-see-all-btn"
            onClick={() => history.push("/products/ALL")}
          >
            See all →
          </Button>
        </div>

        {/* ── exact same grid + card as Products page ── */}
        <div className="pp-grid">
          {products.map((product: Product) => {
            const img = product.productImages?.[0]
              ? `${serverApi}/${product.productImages[0]}`
              : "/img/placeholder.jpg";

            const wished    = isInWishlist(product._id);
            const ratingVal = Number(product.productViews || 0);
            const safeRating = Math.min(ratingVal / 20, 5);
            const reviews   = ratingVal > 10 ? Math.floor(ratingVal / 10) : 0;
            const collLabel = String(product.productCollection ?? "")
              .replace(/-/g, " ");

            return (
              <Box
                key={product._id}
                className="pp-card"
                onClick={() => history.push(`/products/detail/${product._id}`)}
              >
                {/* ── Image ── */}
                <Box className="pp-card-img-wrap">
                  <img
                    src={img}
                    alt={product.productName}
                    className="pp-card-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/placeholder.jpg";
                    }}
                  />

                  {/* Quick-add overlay */}
                  <Box className="pp-card-overlay">
                    <Button
                      className="pp-card-quick-add"
                      onClick={(e) => {
                        e.stopPropagation();
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
                      Quick Add
                    </Button>
                  </Box>

                  {/* Wishlist */}
                  <IconButton
                    className={`pp-card-wish ${wished ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const item: WishlistItem = {
                        _id: product._id,
                        name: product.productName,
                        price: product.productPrice,
                        image: product.productImages?.[0] ?? "",
                        collection: String(product.productCollection),
                      };
                      toggleWishlist(item);
                    }}
                  >
                    {wished
                      ? <FavoriteIcon sx={{ fontSize: 16 }} />
                      : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
                  </IconButton>
                </Box>

                {/* ── Info ── */}
                <Box className="pp-card-info">
                  {collLabel && (
                    <Typography className="pp-card-collection">
                      {collLabel}
                    </Typography>
                  )}

                  <Typography className="pp-card-name" title={product.productName}>
                    {product.productName}
                  </Typography>

                  {/* Rating row */}
                  <Box className="pp-card-rating-row">
                    <Rating
                      value={safeRating}
                      precision={0.5}
                      readOnly
                      size="small"
                      icon={
                        <StarIcon sx={{ fontSize: 13, color: "var(--gold)" }} />
                      }
                      emptyIcon={
                        <StarIcon sx={{ fontSize: 13, opacity: 0.2 }} />
                      }
                    />
                    <Typography className="pp-card-review-count">
                      ({reviews})
                    </Typography>
                    <Box className="pp-card-views">
                      <VisibilityIcon sx={{ fontSize: 12 }} />
                      <span>{product.productViews}</span>
                    </Box>
                  </Box>

                  {/* Price + actions */}
                  <Box className="pp-card-bottom">
                    <Typography className="pp-card-price">
                      ${product.productPrice.toLocaleString()}
                    </Typography>

                    <Box
                      className="pp-card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip title="Add to cart">
                        <IconButton
                          className="pp-card-cart-btn"
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
                          <ShoppingCartIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      <Button
                        className="pp-card-buy-btn"
                        disabled={buyNowLoading}
                        onClick={() => handleBuyNow(product, 1)}
                      >
                        Buy Now
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </div>
      </Container>
    </div>
  );
}