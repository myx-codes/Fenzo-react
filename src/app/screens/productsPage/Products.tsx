import React, { useState, useEffect, useCallback } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Rating,
  Grid, 
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
  Radio,
  RadioGroup,
    FormControlLabel,
  FormControl,
  CircularProgress 
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SortIcon from '@mui/icons-material/Sort';
import { useParams, useLocation, useHistory } from "react-router-dom";

import { useDispatch } from "react-redux";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/cart";
import { WishlistItem } from "../../../lib/types/wishlist";
import { serverApi } from "../../../lib/config";
import ProductService from "../../services/ProductService";
import { setProducts } from "./slice";
import { useCart } from "../../context/CartContext";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import { useGlobals } from "../../hooks/useGlobals";
import { TranslationKey } from "../../i18n/translations";

// Kategoryalar
const categories: Array<{ name: string; labelKey: TranslationKey }> = [
    { name: "ALL", labelKey: "categoryAllProducts" },
    { name: "ELECTRONICS", labelKey: "electronics" },
    { name: "BEAUTY-HEALTH", labelKey: "beautyHealth"},
    { name: "FASHION", labelKey: "fashion"},
    { name: "KIDS", labelKey: "kids" },
    { name: "PARFUM", labelKey: "categoryParfum"},
];

const AI_PAGE_LIMIT = 20;

export function Products() {
    const { t } = useGlobals();
    const dispatch = useDispatch();
    const { onAdd: addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlistContext();
    const { handleBuyNow, loading: buyNowLoading } = useCreateOrder();

    // Global searching
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q") ?? queryParams.get("search") ?? "";

    // State
    const { collection } = useParams<{ collection: string }>();
    const [selectedCategory, setSelectedCategory] = useState(
        collection ? collection.toUpperCase() : "ALL"
    );

    const history = useHistory();
    const [sortOption, setSortOption] = useState("newest");
    const [openCategory, setOpenCategory] = useState(true); 
    const [openSort, setOpenSort] = useState(true);
    const [products, setProductsState] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- HANDLERs ---
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        const encodedQuery = encodeURIComponent(searchQuery);
        const querySuffix = searchQuery ? `?q=${encodedQuery}` : "";
        history.push(`/products/${category}${querySuffix}`);
    };
    const handleToggleCategory = () => setOpenCategory(!openCategory);
    const handleToggleSort = () => setOpenSort(!openSort);
    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortOption(event.target.value);
    };

    const handleProductCard = (id: string) => {
        history.push(`/products/detail/${id}`);
    };

    const buildAiQuery = useCallback((baseQuery: string) => {
        const parts: string[] = [];
        const trimmed = baseQuery.trim();
        if (trimmed) parts.push(trimmed);
        if (selectedCategory !== "ALL") {
            parts.push(selectedCategory.replace(/-/g, " ").toLowerCase());
        }
        if (sortOption === "newest") parts.push("newest");
        if (sortOption === "price-asc") parts.push("cheap");
        if (sortOption === "price-desc") parts.push("expensive");
        return parts.join(" ").replace(/\s+/g, " ").trim();
    }, [selectedCategory, sortOption]);

    const fetchAiProducts = useCallback(async (targetPage: number, mode: "replace" | "append") => {
        setLoading(true);
        setError(null);
        const service = new ProductService();
        try {
            const queryText = buildAiQuery(searchQuery);
            const data = await service.aiSearchProducts({
                query: queryText,
                page: targetPage,
                limit: AI_PAGE_LIMIT,
            });
            setProductsState((prev) => {
                const next = mode === "append" ? [...prev, ...data] : data;
                dispatch(setProducts(next));
                return next;
            });
            setHasMore(data.length === AI_PAGE_LIMIT);
            setPage(targetPage);
        } catch (err) {
            setError("Failed to load products.");
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [buildAiQuery, dispatch, searchQuery]);

    const handleLoadMore = () => {
        if (loading || !hasMore) return;
        fetchAiProducts(page + 1, "append");
    };

  // URL collection effect
  useEffect(() => {
    if (collection) {setSelectedCategory(collection.toUpperCase());
    } else {setSelectedCategory("ALL");}
  }, [collection]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchAiProducts(1, "replace");
    }, [fetchAiProducts]);


  return (
    <div className="products-page"> 
      <Container maxWidth="xl">
        <Grid container spacing={4}>
            
            {/* --- SIDEBAR --- */}
            <Grid size={{xs:12, md:3, lg:2.5}}>
                <Paper className="sidebar-paper">
                    
                    {/* 1. KATEGORIYALAR */}
                    <Box onClick={handleToggleCategory} className="sidebar-header">
                        <Typography variant="h6" className="sidebar-title">
                            <FilterListIcon fontSize="small"/> {t("productsCategories")}
                        </Typography>
                        {openCategory ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                    <Collapse in={openCategory} timeout="auto" unmountOnExit>
                        <List component="nav" className="category-list">
                            {categories.map((cat) => (
                                <ListItemButton
                                    key={cat.name}
                                    selected={selectedCategory === cat.name}
                                    onClick={() => handleCategoryChange(cat.name)}
                                    className={`category-item ${selectedCategory === cat.name ? "active" : ""}`}
                                >
                                    <ListItemText primary={t(cat.labelKey)} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 3 }} />

                    {/* 2. SARALASH */}
                    <Box onClick={handleToggleSort} className="sidebar-header">
                        <Typography variant="h6" className="sidebar-title">
                            <SortIcon fontSize="small"/> {t("productsSortBy")}
                        </Typography>
                        {openSort ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                    <Collapse in={openSort} timeout="auto" unmountOnExit>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="sort-by"
                                name="sort-by-group"
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <FormControlLabel 
                                    value="newest" 
                                    control={<Radio size="small" />} 
                                    label={t("productsNewest")} 
                                    sx={{ color: '#555' }}
                                />
                                <FormControlLabel 
                                    value="price-asc" 
                                    control={<Radio size="small" />} 
                                    label={t("productsLowPrice")} 
                                    sx={{ color: '#555' }}
                                />
                                <FormControlLabel 
                                    value="price-desc" 
                                    control={<Radio size="small" />} 
                                    label={t("productsHighPrice")} 
                                    sx={{ color: '#555' }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Collapse>

                    <Divider sx={{ my: 3 }} />

                    {/* 3. FILTRLAR */}
                    {/* <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1rem' }}>
                        Filters
                    </Typography> */}
                    {/* <FormGroup>
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={onlySale} 
                                    onChange={(e) => setOnlySale(e.target.checked)} 
                                    size="small"
                                />
                            } 
                            label="On Sale Items" 
                        />
                    </FormGroup> */}
                </Paper>
            </Grid>

            {/* --- MAIN CONTENT --- */}
            <Grid size={{xs:12, md:9, lg:9.5}}>
                {/* PRODUCT GRID */}
                <div className="products-grid-container">
                    {products.length > 0 ? (
                        products.map((product) => {
                            const imagePath = product.productImages && product.productImages.length > 0
                                ? `${serverApi}/${product.productImages[0]}`
                                : "/img/placeholder.jpg"; 
                            const collectionLabel = String(product.productCollection ?? "").replace(/-/g, " ");
                            const ratingValue = Number(product.productRating ?? 0);
                            const safeRating = Number.isFinite(ratingValue) ? ratingValue : 0;

                            return (
                                <div 
                                key={product._id} 
                                className="product-card"
                                onClick={() =>handleProductCard(product._id)}
                                >
                                    <div className="product-image-box">
                                        <img src={imagePath} alt={product.productName} className="product-img"/>
                                        <IconButton
                                            className="like-btn"
                                            aria-label={isInWishlist(product._id) ? t("removeFromWishlist") : t("addToWishlist")}
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
                                            sx={isInWishlist(product._id) ? { color: 'red' } : undefined}
                                        >
                                            {isInWishlist(product._id) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                                        </IconButton>
                                    </div>

                                    <div className="product-info">                                     
                                        <Typography className="product-name" title={product.productName}>
                                            {product.productName}
                                        </Typography>

                                        {collectionLabel && (
                                            <Typography className="product-collection">
                                                {collectionLabel}
                                            </Typography>
                                        )}

                                        <div className="rating-views-box">
                                            <div className="product-rating">
                                                <Rating value={safeRating} precision={0.5} readOnly size="small" />
                                                <span className="review-count">({safeRating.toFixed(1)})</span>
                                            </div>

                                            <Box className="views-box">
                                                <VisibilityIcon sx={{ fontSize: 17 }} />
                                                <Typography variant="caption">
                                                    {product.productViews}
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
                                                {t("addCart")}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                className="btn-buy"
                                                disabled={buyNowLoading}
                                                onClick={() => handleBuyNow(product, 1)}
                                            >
                                                {t("buyNow")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : loading ? (
                        <Box className="no-products">
                            <CircularProgress size={30} sx={{color: '#1e3c72'}} />
                        </Box>
                    ) : error ? (
                        <Box className="no-products">
                            <Typography variant="h6" color="text.secondary">{error}</Typography>
                        </Box>
                    ) : (
                        <Box className="no-products">
                            <Typography variant="h5" color="text.secondary">{t("noProductsFound")}</Typography>
                        </Box>
                    )}
                </div>

                {hasMore && products.length > 0 && (
                    <Box className="load-more-container">
                        <Button
                            className="load-more-btn"
                            disabled={loading}
                            onClick={handleLoadMore}
                        >
                            {loading ? "Loading..." : "Load more"}
                        </Button>
                    </Box>
                )}
            </Grid>
        </Grid>
      </Container>
    </div>
  );
}