import React, { useState, useEffect, useRef } from "react"; // 1. useEffect va useRef qo'shildi
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Rating,
  Stack,
  Grid, 
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  Radio,
  RadioGroup,
  FormControl,
  CircularProgress // Loading animatsiyasi uchun
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SortIcon from '@mui/icons-material/Sort';

// Redux
import { retrieveProducts } from "./selector";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config"; 

// Kategoryalar
const categories = [
    { name: "ALL", label: "All Products" },
    { name: "ELECTRONICS", label: "Electronics" },
    { name: "FASHION", label: "Fashion" },
    { name: "PARFUM", label: "Parfum"},
    { name: "BEAUTY", label: "Beauty & Health"}
];

/** REDUX SELECTOR */
const ProductsRetriever = createSelector(
    retrieveProducts,
    (Products) => ({ Products })
);

export function Products() {
  const { Products } = useSelector(ProductsRetriever);
  const productsList = Array.isArray(Products) ? Products : [];

  // State
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(8); 
  const [sortOption, setSortOption] = useState("newest");
  const [onlySale, setOnlySale] = useState(false); 
  const [openCategory, setOpenCategory] = useState(true); 
  const [openSort, setOpenSort] = useState(true);
  
  // 2. Observer uchun reference yaratamiz
  const observerTarget = useRef(null); 

  // Handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(8); 
  };

  const handleToggleCategory = () => setOpenCategory(!openCategory);
  const handleToggleSort = () => setOpenSort(!openSort);

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(event.target.value);
  };

  // --- FILTRLASH ---
  const filteredData = productsList.filter((product: Product) => {
    const matchesCategory = selectedCategory === "ALL" || product.productCollection === selectedCategory;
    return matchesCategory; 
  });

  // --- SARALASH ---
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === "price-asc") {
        return a.productPrice - b.productPrice;
    }
    if (sortOption === "price-desc") {
        return b.productPrice - a.productPrice;
    }
    return 0; 
  });

  const productsToShow = sortedData.slice(0, visibleCount);

  // 3. INFINITE SCROLL (Scroll bo'lganda avtomatik ishlash)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Agar ko'rsatilayotganlar umumiy sonidan kam bo'lsa, ko'paytiramiz
          if (visibleCount < sortedData.length) {
            setVisibleCount((prev) => prev + 4);
          }
        }
      },
      { threshold: 1.0 } // Element 100% ko'ringanda ishlaydi
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, visibleCount, sortedData.length]);


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
                            <FilterListIcon fontSize="small"/> Categories
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
                                    <ListItemText primary={cat.label} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 3 }} />

                    {/* 2. SARALASH */}
                    <Box onClick={handleToggleSort} className="sidebar-header">
                        <Typography variant="h6" className="sidebar-title">
                            <SortIcon fontSize="small"/> Sort By
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
                                    label="Newest" 
                                    sx={{ color: '#555' }}
                                />
                                <FormControlLabel 
                                    value="price-asc" 
                                    control={<Radio size="small" />} 
                                    label="Low Price" 
                                    sx={{ color: '#555' }}
                                />
                                <FormControlLabel 
                                    value="price-desc" 
                                    control={<Radio size="small" />} 
                                    label="High Price" 
                                    sx={{ color: '#555' }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Collapse>

                    <Divider sx={{ my: 3 }} />

                    {/* 3. FILTRLAR */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1rem' }}>
                        Filters
                    </Typography>
                    <FormGroup>
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
                    </FormGroup>
                </Paper>
            </Grid>

            {/* --- MAIN CONTENT --- */}
            <Grid size={{xs:12, md:9, lg:9.5}}>
                {/* PRODUCT GRID */}
                <div className="products-grid-container">
                    {productsToShow.length > 0 ? (
                        productsToShow.map((product) => {
                            const imagePath = product.productImages && product.productImages.length > 0
                                ? `${serverApi}/${product.productImages[0]}`
                                : "/img/placeholder.jpg"; 

                            return (
                                <div key={product._id} className="product-card">
                                    <div className="product-image-box">
                                        <img src={imagePath} alt={product.productName} className="product-img"/>
                                        <IconButton className="like-btn" aria-label="add to favorites">
                                            <FavoriteBorderIcon fontSize="small" />
                                        </IconButton>
                                    </div>

                                    <div className="product-info">                                     
                                        <Typography className="product-name" title={product.productName}>
                                            {product.productName}
                                        </Typography>

                                        <div className="rating-views-box">
                                            <div className="product-rating">
                                                <Rating value={product.productViews || 0} precision={0.5} readOnly size="small" />
                                                <span className="review-count">({product.productViews > 10 ? Math.floor(product.productViews / 10) : 0})</span>
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

                                       <div className="action-buttons">
                                            <Button variant="outlined" className="btn-cart">Add Cart</Button>
                                            <Button variant="contained" className="btn-buy">Buy Now</Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <Box className="no-products">
                            <Typography variant="h5" color="text.secondary">No products found.</Typography>
                        </Box>
                    )}
                </div>

                {/* 4. LOAD MORE TUGMASI O'RNIGA OBSERVER ELEMENT */}
                {visibleCount < sortedData.length && (
                    <Box 
                        ref={observerTarget} 
                        className="load-more-container" 
                        sx={{ mt: 3, display: 'flex', justifyContent: 'center', width: '100%', py: 2 }}
                    >
                        {/* Scroll qilib pastga tushganda shu yozuv yoki spinner chiqadi va avtomatik yuklanadi */}
                        <CircularProgress size={30} sx={{color: '#1e3c72'}} />
                    </Box>
                )}
            </Grid>
        </Grid>
      </Container>
    </div>
  );
}