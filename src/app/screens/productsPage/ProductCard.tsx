import React, { useState, useEffect } from "react";
import {
  Container, Grid, Box, Typography, Button, Rating,
  Stack, Chip, IconButton, CircularProgress, Breadcrumbs,
  Link, Divider, Tooltip, Badge
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import StarIcon from '@mui/icons-material/Star';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveProducts } from "./selector";
import { retrieveTopSellers } from "../homePage/selector";
import { setTopSellers } from "../homePage/slice";
import { Product } from "../../../lib/types/product";
import { User } from "../../../lib/types/user";
import { serverApi } from "../../../lib/config";
import ProductService from "../../services/ProductService";
import UserService from "../../services/UserService";
import { useCart } from "../../context/CartContext";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import { CartItem } from "../../../lib/types/cart";
import { WishlistItem } from "../../../lib/types/wishlist";

const ProductsRetriever = createSelector(
  retrieveProducts,
  (products) => ({ products })
);

const TopSellersRetriever = createSelector(
  retrieveTopSellers,
  (topSellers) => ({ topSellers })
);

export function ProductCard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { onAdd: addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistContext();
  const { handleBuyNow, loading: buyNowLoading } = useCreateOrder();
  const { productId } = useParams<{ productId: string }>();
  const { products } = useSelector(ProductsRetriever);
  const { topSellers } = useSelector(TopSellersRetriever);
  const chosenProduct = products?.find((p: Product) => p._id === productId);

  useEffect(() => {
    if (!Array.isArray(topSellers) || topSellers.length === 0) {
      new UserService().getTopSellers()
        .then((data) => dispatch(setTopSellers(data)))
        .catch(() => {});
    }
  }, [topSellers, dispatch]);

  const [product, setProduct] = useState<Product | null>(chosenProduct || null);
  const [related, setRelated] = useState<Product[]>([]);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(!chosenProduct);
  const [activeImage, setActiveImage] = useState("");
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const totalPrice = (product?.productPrice ?? 0) * quantity;
  const sellerProfileId = seller?._id || seller?.userId || product?.userId;

  const handleSellerProfile = () => {
    if (!sellerProfileId) return;
    history.push(`/user/seller/${sellerProfileId}`);
  };

  const formatImage = (img?: string) =>
    img ? `${serverApi}/${img}` : "/img/placeholder.jpg";

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }
    setSeller(null);
    const productService = new ProductService();
    const userService = new UserService();

    const resolveSeller = (productData: any, apiSeller: User | null) => {
      const userData = productData?.user || productData?.seller;
      if (userData && (userData.userNick || userData.userId)) return userData;
      if (apiSeller) return apiSeller;
      const sellers = Array.isArray(topSellers) ? topSellers : [];
      const matched =
        productData?.userId &&
        sellers.find(
          (s: User) =>
            s._id === productData.userId || s.userId === productData.userId
        );
      if (matched) return matched;
      if (sellers.length > 0) return sellers[0];
      return { userNick: "Fenzo Store", userImage: undefined } as User;
    };

    const fetchSellerAndProduct = (data: any) => {
      const productData =
        data?.value?.product || data?.value || data;
      setProduct(productData);
      setActiveImage(formatImage(productData?.productImages?.[0]));
      setActiveThumb(0);
      const userData =
        productData?.user ||
        productData?.seller ||
        data?.value?.user ||
        data?.value?.seller;
      if (userData && (userData.userNick || userData.userId)) {
        setSeller(userData);
        return;
      }
      if (productData?.userId) {
        userService
          .getUser(productData.userId)
          .then((s) => setSeller(resolveSeller(productData, s)))
          .catch(() => setSeller(resolveSeller(productData, null)));
      } else {
        setSeller(resolveSeller(productData, null));
      }
    };

    if (chosenProduct) {
      setProduct(chosenProduct);
      setActiveImage(formatImage(chosenProduct.productImages?.[0]));
      setSeller(resolveSeller(chosenProduct, null));
      productService
        .getProduct(productId)
        .then(fetchSellerAndProduct)
        .catch(() => {});
    } else {
      setLoading(true);
      productService
        .getProduct(productId)
        .then((data) => {
          fetchSellerAndProduct(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [productId, chosenProduct, topSellers]);

  useEffect(() => {
    if (!product || !product._id) {
      setRelated([]);
      return;
    }
    const svc = new ProductService();
    svc
      .getSimilarProducts(product._id, 1, 8)
      .then((items) => {
        const filtered = Array.isArray(items)
          ? items.filter((p) => p._id !== product._id)
          : [];
        setRelated(filtered.slice(0, 8));
      })
      .catch(() => setRelated([]));
  }, [product]);

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem: CartItem = {
      _id: product._id,
      name: product.productName,
      price: product.productPrice,
      quantity,
      image: product.productImages?.[0] ?? "",
      collection: String(product.productCollection),
    };
    addToCart(cartItem);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <Box className="pc-loading-screen">
        <Box className="pc-loading-inner">
          <CircularProgress
            size={48}
            thickness={3}
            sx={{ color: "var(--pc-gold)" }}
          />
          <Typography className="pc-loading-text">
            Loading product…
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="pc-notfound">
        <Box className="pc-notfound-inner">
          <Typography className="pc-notfound-code">404</Typography>
          <Typography className="pc-notfound-title">
            Product not found
          </Typography>
          <Typography className="pc-notfound-sub">
            The item you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            className="pc-notfound-btn"
            onClick={() => history.push("/products/ALL")}
          >
            Back to Store
          </Button>
        </Box>
      </Box>
    );
  }

  const images = product.productImages?.length
    ? product.productImages.map((img) => `${serverApi}/${img}`)
    : ["/img/placeholder.jpg"];

  const reviewCount =
    product.productViews > 10
      ? Math.floor(product.productViews / 10)
      : 0;

  return (
    <div className="pc-page">
      <Container maxWidth="xl" className="pc-container">

        {/* ── TOP NAV ── */}
        <Box className="pc-topnav">
          <Button
            startIcon={<ArrowBackIcon />}
            className="pc-back-btn"
            onClick={() => history.push("/products/ALL")}
          >
            Back
          </Button>

          <Breadcrumbs separator="/" className="pc-breadcrumbs">
            <Link
              className="pc-bread-link"
              onClick={() => history.push("/")}
            >
              <HomeIcon sx={{ fontSize: 14 }} />
              Home
            </Link>
            <Link
              className="pc-bread-link"
              onClick={() => history.push("/products/ALL")}
            >
              Products
            </Link>
            <Typography className="pc-bread-current">
              {product.productName}
            </Typography>
          </Breadcrumbs>

          <Tooltip title="Share">
            <IconButton className="pc-share-btn">
              <ShareOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* ── MAIN GRID ── */}
        <Grid container spacing={4} className="pc-main-grid">

          {/* ── LEFT: GALLERY ── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="pc-gallery">

              {/* Main Image */}
              <Box
                className={`pc-main-img-wrap ${zoomed ? "zoomed" : ""}`}
                onClick={() => setZoomed((z) => !z)}
              >
                <img
                  src={activeImage || images[0]}
                  alt={product.productName}
                  className="pc-main-img"
                />

                {/* Overlays */}
                <Box className="pc-img-overlay">
                  <Chip
                    label={product.productCollection}
                    className="pc-collection-badge"
                  />
                  <IconButton className="pc-zoom-btn">
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Image counter */}
                {images.length > 1 && (
                  <Box className="pc-img-counter">
                    {activeThumb + 1} / {images.length}
                  </Box>
                )}
              </Box>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Box className="pc-thumbs">
                  {images.map((img, i) => (
                    <Box
                      key={i}
                      className={`pc-thumb ${activeThumb === i ? "active" : ""}`}
                      onClick={() => {
                        setActiveImage(img);
                        setActiveThumb(i);
                      }}
                    >
                      <img src={img} alt={`thumb-${i}`} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* ── RIGHT: DETAILS ── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="pc-details">

              {/* Category pill + views */}
              <Box className="pc-meta-row">
                <Chip
                  label={product.productCollection}
                  className="pc-cat-pill"
                />
                <Box className="pc-views-pill">
                  <VisibilityIcon sx={{ fontSize: 13 }} />
                  <span>{product.productViews} views</span>
                </Box>
              </Box>

              {/* Product Name */}
              <Typography className="pc-product-name">
                {product.productName}
              </Typography>

              {/* Rating row */}
              <Box className="pc-rating-row">
                <Rating
                  value={Math.min(product.productViews / 20, 5)}
                  readOnly
                  precision={0.5}
                  size="small"
                  icon={<StarIcon sx={{ fontSize: 16, color: "var(--pc-gold)" }} />}
                  emptyIcon={<StarIcon sx={{ fontSize: 16, opacity: 0.25 }} />}
                />
                <Typography className="pc-rating-count">
                  ({reviewCount} reviews)
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "var(--pc-border)" }} />
                <Typography className="pc-stock-status">
                  ✓ In Stock
                </Typography>
              </Box>

              {/* Price block */}
              <Box className="pc-price-block">
                <Typography className="pc-price-main">
                  ${totalPrice.toLocaleString()}
                </Typography>
                {quantity > 1 && (
                  <Typography className="pc-price-unit">
                    ${product.productPrice.toLocaleString()} / each
                  </Typography>
                )}
              </Box>

              <Divider className="pc-divider" />

              {/* Description */}
              <Typography className="pc-desc">
                {product.productDesc ||
                  "Premium quality product crafted with exceptional materials for lasting performance and elegance."}
              </Typography>

              {/* Seller */}
              <Box
                className="pc-seller-row"
                onClick={handleSellerProfile}
                sx={{ cursor: sellerProfileId ? "pointer" : "default" }}
              >
                <img
                  src={
                    seller?.userImage
                      ? `${serverApi}/${seller.userImage}`
                      : "https://via.placeholder.com/80?text=S"
                  }
                  alt={seller?.userNick || "Seller"}
                  className="pc-seller-avatar"
                />
                <Box>
                  <Typography className="pc-seller-label">Sold by</Typography>
                  <Typography className="pc-seller-name">
                    {seller?.userNick || "Fenzo Store"}
                  </Typography>
                </Box>
                <VerifiedOutlinedIcon
                  className="pc-verified-icon"
                  fontSize="small"
                />
              </Box>

              <Divider className="pc-divider" />

              {/* Quantity */}
              <Box className="pc-qty-section">
                <Typography className="pc-qty-label">Quantity</Typography>
                <Box className="pc-qty-control">
                  <IconButton
                    className="pc-qty-btn"
                    onClick={() => handleQuantity("dec")}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography className="pc-qty-value">{quantity}</Typography>
                  <IconButton
                    className="pc-qty-btn"
                    onClick={() => handleQuantity("inc")}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box className="pc-actions">
                <Button
                  className={`pc-btn-cart ${addedToCart ? "added" : ""}`}
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  onClick={handleAddToCart}
                >
                  {addedToCart ? "Added!" : "Add to Cart"}
                </Button>

                <Button
                  className="pc-btn-buy"
                  fullWidth
                  disabled={buyNowLoading}
                  onClick={() => handleBuyNow(product as any, quantity)}
                >
                  {buyNowLoading ? "Processing…" : "Buy Now"}
                </Button>

                <Tooltip
                  title={
                    isInWishlist(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <IconButton
                    className={`pc-btn-wish ${isInWishlist(product._id) ? "active" : ""}`}
                    onClick={() => {
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
                    {isInWishlist(product._id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Perks */}
              <Box className="pc-perks">
                <Box className="pc-perk-item">
                  <LocalShippingOutlinedIcon className="pc-perk-icon" />
                  <Box>
                    <Typography className="pc-perk-title">
                      Free Delivery
                    </Typography>
                    <Typography className="pc-perk-sub">
                      Orders over $50
                    </Typography>
                  </Box>
                </Box>
                <Box className="pc-perk-item">
                  <VerifiedOutlinedIcon className="pc-perk-icon" />
                  <Box>
                    <Typography className="pc-perk-title">
                      Guaranteed
                    </Typography>
                    <Typography className="pc-perk-sub">
                      100% authentic
                    </Typography>
                  </Box>
                </Box>
                <Box className="pc-perk-item">
                  <LoopOutlinedIcon className="pc-perk-icon" />
                  <Box>
                    <Typography className="pc-perk-title">
                      Easy Returns
                    </Typography>
                    <Typography className="pc-perk-sub">
                      30-day policy
                    </Typography>
                  </Box>
                </Box>
              </Box>

            </Box>
          </Grid>
        </Grid>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <Box className="pc-related">
            <Box className="pc-related-header">
              <Typography className="pc-related-title">
                More from{" "}
                <span className="pc-related-collection">
                  {product.productCollection}
                </span>
              </Typography>
              <Button
                className="pc-related-see-all"
                onClick={() =>
                  history.push(
                    `/products/${product.productCollection}`
                  )
                }
              >
                See all →
              </Button>
            </Box>

            <Grid container spacing={2.5}>
              {related.map((rp) => {
                const imgPath =
                  rp.productImages && rp.productImages.length > 0
                    ? `${serverApi}/${rp.productImages[0]}`
                    : "/img/placeholder.jpg";
                const rpReviews =
                  rp.productViews > 10
                    ? Math.floor(rp.productViews / 10)
                    : 0;
                const wished = isInWishlist(rp._id);

                return (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={rp._id}>
                    <Box
                      className="pc-rcard"
                      onClick={() =>
                        history.push(`/products/detail/${rp._id}`)
                      }
                    >
                      {/* Image */}
                      <Box className="pc-rcard-img-wrap">
                        <img
                          src={imgPath}
                          alt={rp.productName}
                          className="pc-rcard-img"
                        />
                        <IconButton
                          className={`pc-rcard-wish ${wished ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const item: WishlistItem = {
                              _id: rp._id,
                              name: rp.productName,
                              price: rp.productPrice,
                              image: rp.productImages?.[0] ?? "",
                              collection: String(rp.productCollection),
                            };
                            toggleWishlist(item);
                          }}
                        >
                          {wished ? (
                            <FavoriteIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Box>

                      {/* Info */}
                      <Box className="pc-rcard-info">
                        <Typography className="pc-rcard-name" title={rp.productName}>
                          {rp.productName}
                        </Typography>

                        <Box className="pc-rcard-rating-row">
                          <Rating
                            value={Math.min(rp.productViews / 20, 5)}
                            readOnly
                            precision={0.5}
                            size="small"
                            icon={
                              <StarIcon
                                sx={{ fontSize: 13, color: "var(--pc-gold)" }}
                              />
                            }
                            emptyIcon={
                              <StarIcon
                                sx={{ fontSize: 13, opacity: 0.2 }}
                              />
                            }
                          />
                          <Typography className="pc-rcard-reviews">
                            ({rpReviews})
                          </Typography>
                        </Box>

                        <Box className="pc-rcard-bottom">
                          <Typography className="pc-rcard-price">
                            ${rp.productPrice.toLocaleString()}
                          </Typography>
                          <Button
                            className="pc-rcard-cart-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const cartItem: CartItem = {
                                _id: rp._id,
                                name: rp.productName,
                                price: rp.productPrice,
                                quantity: 1,
                                image: rp.productImages?.[0] ?? "",
                                collection: String(rp.productCollection),
                              };
                              addToCart(cartItem);
                            }}
                          >
                            <ShoppingCartIcon sx={{ fontSize: 15 }} />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Container>
    </div>
  );
}