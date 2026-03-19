import React, { useState, useEffect } from "react";
import { 
Container, Grid, Box, Typography, Button, Rating, Stack, Chip, IconButton, CircularProgress, Breadcrumbs, Link 
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HomeIcon from '@mui/icons-material/Home';

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



// Selectors
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

// Ensure topSellers are loaded (for seller fallback when user lands directly on product page)
useEffect(() => {
  if (!Array.isArray(topSellers) || topSellers.length === 0) {
    new UserService().getTopSellers()
      .then((data) => dispatch(setTopSellers(data)))
      .catch(() => {});
  }
}, [topSellers, dispatch]);

const [product, setProduct] = useState<Product | null>(chosenProduct || null);
const [related, setRelated] = useState<Product[]>([]); // related products from same category
const [seller, setSeller] = useState<User | null>(null);
const [loading, setLoading] = useState(!chosenProduct);
const [activeImage, setActiveImage] = useState("");
const [quantity, setQuantity] = useState(1);
const totalPrice = (product?.productPrice ?? 0) * quantity;
const sellerProfileId = seller?._id || seller?.userId || product?.userId;

const handleSellerProfile = () => {
  if (!sellerProfileId) return;
  history.push(`/user/seller/${sellerProfileId}`);
};


useEffect(() => {
  if (!productId) {
    setProduct(null);
    setLoading(false);
    return;
  }
  setSeller(null);
  const productService = new ProductService();
  const userService = new UserService();
  const formatImage = (img?: string) => img ? `${serverApi}/${img}` : "/img/placeholder.jpg";

  const resolveSeller = (productData: any, apiSeller: User | null) => {
    // 1. Use seller from product API response if present
    const userData = productData?.user || productData?.seller;
    if (userData && (userData.userNick || userData.userId)) return userData;
    if (apiSeller) return apiSeller;
    // 2. Match product.userId to topSellers by _id
    const sellers = Array.isArray(topSellers) ? topSellers : [];
    const matched = productData?.userId && sellers.find((s: User) => s._id === productData.userId || s.userId === productData.userId);
    if (matched) return matched;
    // 3. Use first top seller as fallback
    if (sellers.length > 0) return sellers[0];
    // 4. Ultimate fallback
    return { userNick: "Fenzo Store", userImage: undefined } as User;
  };

  const fetchSellerAndProduct = (data: any) => {
    const productData = data?.value?.product || data?.value || data;
    setProduct(productData);
    setActiveImage(formatImage(productData?.productImages?.[0]));
    const userData = productData?.user || productData?.seller
      || data?.value?.user || data?.value?.seller;
    if (userData && (userData.userNick || userData.userId)) {
      setSeller(userData);
      return;
    }
    if (productData?.userId) {
      userService.getUser(productData.userId)
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
      productService.getProduct(productId)
          .then(fetchSellerAndProduct)
          .catch(() => {});
  } else {
      setLoading(true);
      productService.getProduct(productId)
          .then((data) => {
            fetchSellerAndProduct(data);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
  }
}, [productId, chosenProduct, topSellers]);

const handleQuantity = (type: "inc" | "dec") => {
  if (type === "inc") setQuantity(prev => prev + 1);
  if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
};

// when a product is loaded, fetch up to 4 other random products in same collection
useEffect(() => {
  if (!product || !product.productCollection) {
    setRelated([]);
    return;
  }
  const service = new ProductService();
  service
    .getAllProducts({ productCollection: String(product.productCollection) })
    .then((all) => {
      const others = all.filter((p) => p._id !== product._id);
      // shuffle
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }
      setRelated(others.slice(0, 4));
    })
    .catch(() => {
      setRelated([]);
    });
}, [product]);

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
          <Button startIcon={<ArrowBackIcon />} onClick={() => history.push("/products/ALL")} className="back-btn">
              Back to products
          </Button>

          <Breadcrumbs separator="›">
              <Link onClick={() => history.push("/")} className="breadcrumb-link"><HomeIcon fontSize="small"/> Home</Link>
              <Link onClick={() => history.push("/products/ALL")} className="breadcrumb-link">Products</Link>
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

            {/* Seller Info - always shown with fallback */}
            <Stack direction="row" alignItems="center" spacing={1} className="user-info" sx={{ mb: 2 }}>
              <img
                src={seller?.userImage ? `${serverApi}/${seller.userImage}` : "https://via.placeholder.com/80?text=S"}
                alt={seller?.userNick || "Seller"}
                className="user-avatar"
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
              />
              <Typography className="username" variant="body1">
                <Box
                  component="span"
                  onClick={handleSellerProfile}
                  sx={{
                    cursor: sellerProfileId ? 'pointer' : 'default',
                    '&:hover': sellerProfileId ? { textDecoration: 'underline' } : undefined,
                  }}
                >
                  {seller?.userNick || "Fenzo Store"}
                </Box>
              </Typography>
            </Stack>


            {/* Rating & Views */}
            <div className="rating-row">
              <Rating value={product.productViews} readOnly precision={0.5} size="small"/>
              <div className="views"><VisibilityIcon fontSize="small"/>{product.productViews} views</div>
            </div>

            {/* Price */}
            <div className="price">${totalPrice}</div>

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
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                className="btn-buy"
                onClick={() => {
                  const cartItem: CartItem = {
                    _id: product._id,
                    name: product.productName,
                    price: product.productPrice,
                    quantity,
                    image: product.productImages?.[0] ?? "",
                    collection: String(product.productCollection),
                  };
                  addToCart(cartItem);
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                startIcon={product && isInWishlist(product._id) ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
                className="save-btn"
                onClick={() => {
                  if (!product) return;
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
                {product && isInWishlist(product._id) ? "Saved" : "Save"}
              </Button>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <div>
                <small>Seller</small>
                <strong
                  onClick={handleSellerProfile}
                  style={{
                    cursor: sellerProfileId ? "pointer" : "default",
                    textDecoration: sellerProfileId ? "underline" : "none",
                  }}
                >
                  {seller?.userNick || "Fenzo Store"}
                </strong>
              </div>
              <div><small>Category</small><strong>{product.productCollection}</strong></div>
            </div>

          </div>
        </Grid>
      </Grid>

      {/* related products section */}
      {related.length > 0 && (
        <Box sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            More from {product?.productCollection}
          </Typography>
          <Grid container spacing={2}>
            {related.map((rp) => {
              const imgPath =
                rp.productImages && rp.productImages.length > 0
                  ? `${serverApi}/${rp.productImages[0]}`
                  : "/img/placeholder.jpg";
              return (
                <Grid size={{ xs: 6, md: 3 }} key={rp._id}>
                  <div
                    className="product-card"
                    onClick={() => history.push(`/products/detail/${rp._id}`)}
                  >
                    <div
                      className="product-image-box"
                    >
                      <img
                        src={imgPath}
                        alt={rp.productName}
                        className="product-img"
                      />
                      <IconButton
                        className="like-btn"
                        aria-label={isInWishlist(rp._id) ? "Remove from wishlist" : "Add to wishlist"}
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
                        sx={isInWishlist(rp._id) ? { color: 'red' } : undefined}
                      >
                        {isInWishlist(rp._id) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                      </IconButton>
                    </div>

                    <div className="product-info">
                      <Typography className="product-name" title={rp.productName}>
                        {rp.productName}
                      </Typography>

                      <div className="rating-views-box">
                        <div className="product-rating">
                          <Rating value={rp.productViews || 0} precision={0.5} readOnly size="small" />
                          <span className="review-count">({rp.productViews > 10 ? Math.floor(rp.productViews / 10) : 0})</span>
                        </div>

                        <Box className="views-box">
                          <VisibilityIcon sx={{ fontSize: 17 }} />
                          <Typography variant="caption">
                            {rp.productViews}
                          </Typography>
                        </Box>
                      </div>

                      <Box className="price-box">
                        <Typography className="product-price">
                          ${rp.productPrice.toLocaleString()}
                        </Typography>
                      </Box>

                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outlined"
                          className="btn-cart"
                          onClick={() => {
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
                          Add Cart
                        </Button>
                        <Button
                          variant="contained"
                          className="btn-buy"
                          disabled={buyNowLoading}
                          onClick={() => handleBuyNow(rp as any, 1)}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
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