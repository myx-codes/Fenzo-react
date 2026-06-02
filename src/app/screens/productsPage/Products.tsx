import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Rating,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SortIcon from "@mui/icons-material/Sort";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import SearchOffIcon from "@mui/icons-material/SearchOff";
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

const categories: Array<{ name: string; labelKey: TranslationKey; icon: string }> = [
  { name: "ALL",            labelKey: "categoryAllProducts", icon: "✦" },
  { name: "ELECTRONICS",   labelKey: "electronics",         icon: "⚡" },
  { name: "BEAUTY-HEALTH", labelKey: "beautyHealth",        icon: "✿" },
  { name: "FASHION",       labelKey: "fashion",             icon: "◈" },
  { name: "KIDS",          labelKey: "kids",                icon: "★" },
  { name: "PARFUM",        labelKey: "categoryParfum",      icon: "◉" },
];

const sortOptions: Array<{ value: string; labelKey: TranslationKey }> = [
  { value: "newest",     labelKey: "productsNewest"   },
  { value: "price-asc",  labelKey: "productsLowPrice" },
  { value: "price-desc", labelKey: "productsHighPrice"},
];

const AI_PAGE_LIMIT = 20;

export function Products() {
  const { t } = useGlobals();
  const dispatch = useDispatch();
  const { onAdd: addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistContext();
  const { handleBuyNow, loading: buyNowLoading } = useCreateOrder();

  const location  = useLocation();
  const queryParams   = new URLSearchParams(location.search);
  const searchQuery   = queryParams.get("q") ?? queryParams.get("search") ?? "";

  const { collection } = useParams<{ collection: string }>();
  const history = useHistory();

  const [selectedCategory, setSelectedCategory] = useState(
    collection ? collection.toUpperCase() : "ALL"
  );
  const [sortOption,     setSortOption]     = useState("newest");
  const [openCategory,   setOpenCategory]   = useState(true);
  const [openSort,       setOpenSort]       = useState(true);
  const [products,       setProductsState]  = useState<Product[]>([]);
  const [page,           setPage]           = useState(1);
  const [hasMore,        setHasMore]        = useState(true);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [viewMode,       setViewMode]       = useState<"grid" | "list">("grid");
  const [addedIds,       setAddedIds]       = useState<Set<string>>(new Set());

  const activeCategoryLabel = categories.find(
    (cat) => cat.name === selectedCategory
  )?.labelKey;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const encodedQuery  = encodeURIComponent(searchQuery);
    const querySuffix   = searchQuery ? `?q=${encodedQuery}` : "";
    history.push(`/products/${category}${querySuffix}`);
  };

  const handleProductCard = (id: string) =>
    history.push(`/products/detail/${id}`);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const cartItem: CartItem = {
      _id:        product._id,
      name:       product.productName,
      price:      product.productPrice,
      quantity:   1,
      image:      product.productImages?.[0] ?? "",
      collection: String(product.productCollection),
    };
    addToCart(cartItem);
    setAddedIds((prev) => new Set(prev).add(product._id));
    setTimeout(
      () =>
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(product._id);
          return next;
        }),
      2000
    );
  };

  const buildAiQuery = useCallback(
    (baseQuery: string) => {
      const parts: string[] = [];
      const trimmed = baseQuery.trim();
      if (trimmed) parts.push(trimmed);
      if (selectedCategory !== "ALL")
        parts.push(selectedCategory.replace(/-/g, " ").toLowerCase());
      if (sortOption === "newest")     parts.push("newest");
      if (sortOption === "price-asc")  parts.push("cheap");
      if (sortOption === "price-desc") parts.push("expensive");
      return parts.join(" ").replace(/\s+/g, " ").trim();
    },
    [selectedCategory, sortOption]
  );

  const fetchAiProducts = useCallback(
    async (targetPage: number, mode: "replace" | "append") => {
      setLoading(true);
      setError(null);
      const service = new ProductService();
      try {
        const queryText = buildAiQuery(searchQuery);
        const data = await service.aiSearchProducts({
          query: queryText,
          page:  targetPage,
          limit: AI_PAGE_LIMIT,
        });
        setProductsState((prev) => {
          const next = mode === "append" ? [...prev, ...data] : data;
          dispatch(setProducts(next));
          return next;
        });
        setHasMore(data.length === AI_PAGE_LIMIT);
        setPage(targetPage);
      } catch {
        setError("Failed to load products.");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [buildAiQuery, dispatch, searchQuery]
  );

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    fetchAiProducts(page + 1, "append");
  };

  useEffect(() => {
    setSelectedCategory(collection ? collection.toUpperCase() : "ALL");
  }, [collection]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchAiProducts(1, "replace");
  }, [fetchAiProducts]);

  /* ─── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="pp-page">
      <Container maxWidth="xl" className="pp-container">

        {/* ── PAGE HEADER ── */}
        <Box className="pp-header">
          <Box className="pp-header-left">
            <Typography className="pp-header-title">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategoryLabel
                ? t(activeCategoryLabel)
                : t("products")}
            </Typography>
            <Typography className="pp-header-count">
              {products.length > 0
                ? `${products.length}${hasMore ? "+" : ""} products found`
                : "Discover premium products"}
            </Typography>
          </Box>

          {/* View toggle */}
          <Box className="pp-view-toggle">
            <Tooltip title="Grid view">
              <IconButton
                className={`pp-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="List view">
              <IconButton
                className={`pp-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <ViewListIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={3} className="pp-layout">

          {/* ── SIDEBAR ── */}
          <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
            <Box className="pp-sidebar">

              {/* Categories */}
              <Box className="pp-sidebar-block">
                <Box
                  className="pp-sidebar-head"
                  onClick={() => setOpenCategory((o) => !o)}
                >
                  <Box className="pp-sidebar-head-left">
                    <FilterListIcon className="pp-sidebar-icon" />
                    <Typography className="pp-sidebar-label">
                      {t("productsCategories")}
                    </Typography>
                  </Box>
                  {openCategory ? (
                    <ExpandLess className="pp-sidebar-chevron" />
                  ) : (
                    <ExpandMore className="pp-sidebar-chevron" />
                  )}
                </Box>

                <Collapse in={openCategory} timeout="auto" unmountOnExit>
                  <List className="pp-cat-list" disablePadding>
                    {categories.map((cat) => (
                      <ListItemButton
                        key={cat.name}
                        disableRipple
                        className={`pp-cat-item ${
                          selectedCategory === cat.name ? "active" : ""
                        }`}
                        onClick={() => handleCategoryChange(cat.name)}
                      >
                        <span className="pp-cat-icon">{cat.icon}</span>
                        <ListItemText
                          primary={t(cat.labelKey)}
                          className="pp-cat-text"
                        />
                        {selectedCategory === cat.name && (
                          <Box className="pp-cat-dot" />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>

              <Divider className="pp-sidebar-divider" />

              {/* Sort */}
              <Box className="pp-sidebar-block">
                <Box
                  className="pp-sidebar-head"
                  onClick={() => setOpenSort((o) => !o)}
                >
                  <Box className="pp-sidebar-head-left">
                    <SortIcon className="pp-sidebar-icon" />
                    <Typography className="pp-sidebar-label">
                      {t("productsSortBy")}
                    </Typography>
                  </Box>
                  {openSort ? (
                    <ExpandLess className="pp-sidebar-chevron" />
                  ) : (
                    <ExpandMore className="pp-sidebar-chevron" />
                  )}
                </Box>

                <Collapse in={openSort} timeout="auto" unmountOnExit>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="pp-sort-group"
                    >
                      {sortOptions.map((opt) => (
                        <FormControlLabel
                          key={opt.value}
                          value={opt.value}
                          className={`pp-sort-item ${
                            sortOption === opt.value ? "active" : ""
                          }`}
                          control={
                            <Radio
                              size="small"
                              className="pp-sort-radio"
                            />
                          }
                          label={t(opt.labelKey)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Collapse>
              </Box>
            </Box>
          </Grid>

          {/* ── MAIN ── */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>

            {/* Active filters row */}
            {(selectedCategory !== "ALL" || searchQuery) && (
              <Box className="pp-active-filters">
                {selectedCategory !== "ALL" && (
                  <Chip
                    label={selectedCategory.replace(/-/g, " ")}
                    onDelete={() => handleCategoryChange("ALL")}
                    className="pp-filter-chip"
                    size="small"
                  />
                )}
                {searchQuery && (
                  <Chip
                    label={`"${searchQuery}"`}
                    onDelete={() => history.push(`/products/${selectedCategory}`)}
                    className="pp-filter-chip"
                    size="small"
                  />
                )}
              </Box>
            )}

            {/* Grid */}
            <Box className={`pp-grid ${viewMode === "list" ? "pp-grid--list" : ""}`}>

              {products.length > 0 ? (
                products.map((product) => {
                  const imagePath =
                    product.productImages?.length
                      ? `${serverApi}/${product.productImages[0]}`
                      : "/img/placeholder.jpg";
                  const ratingValue = Number(product.productRating ?? 0);
                  const safeRating  = Number.isFinite(ratingValue) ? ratingValue : 0;
                  const wished      = isInWishlist(product._id);
                  const justAdded   = addedIds.has(product._id);
                  const collLabel   = String(product.productCollection ?? "")
                    .replace(/-/g, " ");

                  return (
                    <Box
                      key={product._id}
                      className="pp-card"
                      onClick={() => handleProductCard(product._id)}
                    >
                      {/* Image */}
                      <Box className="pp-card-img-wrap">
                        <img
                          src={imagePath}
                          alt={product.productName}
                          className="pp-card-img"
                        />

                        {/* Wish btn */}
                        <IconButton
                          className={`pp-card-wish ${wished ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const item: WishlistItem = {
                              _id:        product._id,
                              name:       product.productName,
                              price:      product.productPrice,
                              image:      product.productImages?.[0] ?? "",
                              collection: String(product.productCollection),
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

                        {/* Quick-add overlay */}
                        <Box className="pp-card-overlay">
                          <Button
                            className="pp-card-quick-add"
                            startIcon={<ShoppingCartIcon sx={{ fontSize: 15 }} />}
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            {justAdded ? "Added!" : "Quick Add"}
                          </Button>
                        </Box>
                      </Box>

                      {/* Info */}
                      <Box className="pp-card-info">
                        {collLabel && (
                          <Typography className="pp-card-collection">
                            {collLabel}
                          </Typography>
                        )}

                        <Typography className="pp-card-name" title={product.productName}>
                          {product.productName}
                        </Typography>

                        <Box className="pp-card-rating-row">
                          <Rating
                            value={safeRating}
                            precision={0.5}
                            readOnly
                            size="small"
                            icon={
                              <StarIcon sx={{ fontSize: 13, color: "var(--pp-gold)" }} />
                            }
                            emptyIcon={
                              <StarIcon sx={{ fontSize: 13, opacity: 0.2 }} />
                            }
                          />
                          <Typography className="pp-card-review-count">
                            ({safeRating.toFixed(1)})
                          </Typography>
                          <Box className="pp-card-views">
                            <VisibilityIcon sx={{ fontSize: 12 }} />
                            <span>{product.productViews}</span>
                          </Box>
                        </Box>

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
                                className={`pp-card-cart-btn ${justAdded ? "added" : ""}`}
                                onClick={(e) => handleAddToCart(e, product)}
                              >
                                <ShoppingCartIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Button
                              className="pp-card-buy-btn"
                              disabled={buyNowLoading}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyNow(product, 1);
                              }}
                            >
                              {t("buyNow")}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              ) : loading ? (
                /* Skeleton placeholders */
                Array.from({ length: 8 }).map((_, i) => (
                  <Box key={i} className="pp-skeleton" />
                ))
              ) : error ? (
                <Box className="pp-empty">
                  <SearchOffIcon className="pp-empty-icon" />
                  <Typography className="pp-empty-title">{error}</Typography>
                  <Button
                    className="pp-empty-btn"
                    onClick={() => fetchAiProducts(1, "replace")}
                  >
                    Try again
                  </Button>
                </Box>
              ) : (
                <Box className="pp-empty">
                  <SearchOffIcon className="pp-empty-icon" />
                  <Typography className="pp-empty-title">
                    {t("noProductsFound")}
                  </Typography>
                  <Typography className="pp-empty-sub">
                    Try a different category or search term
                  </Typography>
                  <Button
                    className="pp-empty-btn"
                    onClick={() => handleCategoryChange("ALL")}
                  >
                    Browse all products
                  </Button>
                </Box>
              )}
            </Box>

            {/* Load More */}
            {hasMore && products.length > 0 && (
              <Box className="pp-load-more-wrap">
                <Button
                  className="pp-load-more-btn"
                  disabled={loading}
                  onClick={handleLoadMore}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} sx={{ color: "inherit" }} />
                    ) : undefined
                  }
                >
                  {loading ? "Loading…" : "Load more products"}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}