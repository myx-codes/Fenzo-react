import React, { useEffect, useState } from "react";
import { Container, Typography, Box, IconButton, Button, CircularProgress } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useHistory } from "react-router-dom";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/cart";
import { WishlistItem } from "../../../lib/types/wishlist";
import ProductService from "../../services/ProductService";
import { useCart } from "../../context/CartContext";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import { serverApi } from "../../../lib/config";

export function RecommendedProducts() {
  const history = useHistory();
  const { onAdd: addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistContext();
  const { handleBuyNow, loading: buyNowLoading } = useCreateOrder();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const svc = new ProductService();

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const recommendedProducts = await svc.getRecommendedProducts(1, 10);
        const nextProducts = recommendedProducts.length > 0
          ? recommendedProducts
          : await svc.getProducts({ page: 1, limit: 10, order: "productViews" });

        if (isMounted) setProducts(Array.isArray(nextProducts) ? nextProducts : []);
      } catch {
        try {
          const fallbackProducts = await svc.getProducts({ page: 1, limit: 10, order: "productViews" });
          if (isMounted) setProducts(Array.isArray(fallbackProducts) ? fallbackProducts : []);
        } catch {
          if (isMounted) {
            setProducts([]);
            setError("Failed to load recommended products.");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="featured-section">
        <Container>
          <Typography variant="h2" className="section-title">Recommended for you</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </div>
    );
  }

  if (!products || products.length === 0) {
    if (error) {
      return null;
    }
    return (
      <div className="featured-section">
        <Container>
          <Typography variant="h2" className="section-title">Recommended for you</Typography>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">No recommendations available yet.</Typography>
          </Box>
        </Container>
      </div>
    );
  }

  const handleProductCard = (id: string) => history.push(`/products/detail/${id}`);

  return (
    <div className="featured-section">
      <Container>
        <Typography variant="h2" className="section-title">Recommended for you</Typography>

        <div className="products-grid">
          {products.map((product) => {
            const imagePath = product.productImages?.[0] ? `${serverApi}/${product.productImages[0]}` : "/img/placeholder.jpg";
            const cartItem: CartItem = {
              _id: product._id,
              name: product.productName,
              price: product.productPrice,
              quantity: 1,
              image: product.productImages?.[0] ?? "",
              collection: String(product.productCollection),
            };
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
                      (e.target as HTMLImageElement).src = "/img/placeholder.jpg";
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
                    {isInWishlist(product._id) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                </div>

                <div className="product-info">
                  <Typography className="product-name">{product.productName}</Typography>

                  <div className="product-meta">
                    <div className="product-rating">
                      <Typography variant="body2">{product.productRating ?? 0}</Typography>
                    </div>
                    <Box className="product-views">
                      <VisibilityIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{product.productViews}</Typography>
                    </Box>
                  </div>

                  <Typography className="product-price">${product.productPrice}</Typography>

                  <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outlined"
                      className="btn-cart"
                      onClick={() => addToCart(cartItem)}
                    >
                      Add Cart
                    </Button>
                    <Button variant="contained" className="btn-buy" disabled={buyNowLoading} onClick={() => handleBuyNow(product, 1)}>
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

export default RecommendedProducts;
