import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Button,
  Rating,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  IconButton
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Agar MUI v6 ishlatsangiz Grid2. v5 bo'lsa shunchaki Grid qoldiring.
import { useParams, useHistory } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import UserService from "../../services/UserService";
import { SellerProfile } from "../../../lib/types/seller";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/cart";
import { WishlistItem } from "../../../lib/types/wishlist";
import { useCart } from "../../context/CartContext";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCreateOrder } from "../../hooks/useCreateOrder";

const userService = new UserService();

function formatDate(d: Date | string | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function SellerPage() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleWishlist, isInWishlist } = useWishlistContext();
  const { onAdd: addToCart } = useCart();
  const { handleBuyNow, loading: buyNowLoading } = useCreateOrder();

  const handleProductCard = (productId: string) => {
    history.push(`/products/detail/${productId}`);
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Seller ID is missing.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    userService
      .getSeller(id)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || "Failed to load seller.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <CircularProgress sx={{ color: "#1e3c72" }} />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {error || "Seller not found."}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.push("/")} className="seller-back-btn">
          Back to Home
        </Button>
      </Container>
    );
  }

  const { user, productsAdded, products, productsSold, topSellingProducts } = profile;
  const imagePath = user.userImage ? `${serverApi}/${user.userImage}` : undefined;

  // Products bilan bir xil bo'lgan Product Card render qiluvchi funksiya
  const renderProductCard = (product: any) => {
    const productImgPath = product.productImages && product.productImages.length > 0
      ? `${serverApi}/${product.productImages[0]}`
      : "/img/placeholder.jpg";

    // normalize view count (API may return different field names)
    const rawViews = product.productViews ?? product.views ?? product.viewsCount ?? product.viewCount ?? product.view_count ?? product.views_count ?? product.totalViews ?? 0;
    const views = Number(rawViews) || 0;

    return (
      <div
        key={product._id}
        className="product-card"
        onClick={() => handleProductCard(product._id)}
      >
        <div className="product-image-box">
          <img
            src={productImgPath}
            alt={product.productName}
            className="product-img"
            onClick={() => handleProductCard(product._id)}
          />
          <IconButton
            className="like-btn"
            aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
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
            sx={isInWishlist(product._id) ? { color: "red" } : undefined}
          >
            {isInWishlist(product._id) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </div>

        <div className="product-info">
          <Typography className="product-name" title={product.productName}>
            {product.productName}
          </Typography>

          <div className="rating-views-box">
            <div className="product-rating">
              <Rating value={views || 0} precision={0.5} readOnly size="small" />
              <span className="review-count">({views > 10 ? Math.floor(views / 10) : 0})</span>
            </div>

            <Box className="views-box">
              <VisibilityIcon sx={{ fontSize: 17 }} />
              <Typography variant="caption">
                {views.toLocaleString()}
              </Typography>
            </Box>
          </div>

          <Box className="price-box">
            <Typography className="product-price">
              ${product.productPrice.toLocaleString()}
            </Typography>
          </Box>

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
      </div>
    );
  };

  return (
    <div className="products-page"> {/* Barcha CSS lar ishlashi uchun asosiy wrapper */}
      <Container maxWidth="xl" className="seller-page-container">
        
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.push("/")} className="seller-back-btn">
          Back to Home
        </Button>

        <Paper elevation={0} className="seller-paper">
          
          {/* SOTUVCHI PROFIL QISMI (Header) */}
          <Box className="seller-header">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems={{ xs: "center", sm: "flex-start" }}>
              <Avatar src={imagePath} alt={user.userNick} className="seller-avatar">
                <StorefrontIcon sx={{ fontSize: 50, color: "#a0b2c6" }} />
              </Avatar>
              <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="h4" gutterBottom className="seller-name">
                  {user.userNick}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent={{ xs: "center", sm: "flex-start" }} alignItems="center">
                  <span className="seller-status-badge">
                    {user.userStatus ?? "ACTIVE"}
                  </span>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Rating value={user.userPoints ?? 0} precision={0.1} readOnly size="small" sx={{ color: "#ffb400" }} />
                    <Typography variant="body2" color="#666" fontWeight={600}>
                      ({user.userPoints ?? 0})
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>

           {/* SOTUVCHI HAQIDA MA'LUMOT */}
           <Box className="seller-section-wrapper">
            <Typography variant="h4" className="seller-section-title">
              Seller Information
            </Typography>
            <Grid container spacing={4}>
              {user.userDesc && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" className="seller-info-label">ABOUT</Typography>
                  <Typography variant="body1" color="#444" lineHeight={1.6}>
                    {user.userDesc}
                  </Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" className="seller-info-label">
                  <PhoneIcon sx={{ fontSize: 20 }} /> CONTACT
                </Typography>
                <Typography variant="body1" color="#444" fontWeight={500}>
                  {user.userPhone || "Not provided"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" className="seller-info-label">
                  <LocationOnIcon sx={{ fontSize: 20 }} /> ADDRESS
                </Typography>
                <Typography variant="body1" color="#444" fontWeight={500}>
                  {user.userAddress || "Not provided"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" className="seller-info-label">MEMBER SINCE</Typography>
                <Typography variant="body1" color="#444" fontWeight={500}>
                  {formatDate(user.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: "#eaeaea" }} />

          {/* STATISTIKA */}
          <Box  className="seller-stats-wrapper">
            {[
              { label: "Products added", value: productsAdded },
              { label: "Products sold", value: productsSold },
              {
                label: "Member since",
                value: user.createdAt ? new Date(user.createdAt).getFullYear() : "—",
              },
            ].map((stat, idx) => (
              <Box key={idx} className="seller-stat-box">
                <Typography variant="caption" className="seller-stat-label">
                  {stat.label}
                </Typography>
                <Typography variant="h3" className="seller-stat-value">
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>


          {/* TOP MAHSULOTLAR (Products Grid usulida) */}
          {topSellingProducts.length > 0 && (
            <>
              <Divider sx={{ borderColor: "#eaeaea" }} />
              <Box className="seller-section-wrapper bg-light">
                <Typography variant="h4" className="seller-section-title">
                  <TrendingUpIcon sx={{ color: "#ff9800" }} />
                  Top Selling Products
                </Typography>
                <div className="products-grid-container" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                  {topSellingProducts.map((item) => renderProductCard(item))}
                </div>
              </Box>
            </>
          )}

          {/* BARCHA MAHSULOTLAR (Products Grid usulida) */}
          {products.length > 0 && (
            <>
              <Divider sx={{ borderColor: "#eaeaea" }} />
              <Box className="seller-section-wrapper">
                <Typography variant="h4" className="seller-section-title">
                  <InventoryIcon sx={{ color: "#1e3c72" }} />
                  All Store Products 
                  <span className="seller-count-badge">{products.length}</span>
                </Typography>
                <div className="products-grid-container" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                  {products.map((product) => renderProductCard(product))}
                </div>
              </Box>
            </>
          )}

        </Paper>
      </Container>
    </div>
  );
}