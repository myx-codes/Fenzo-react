import React, { useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Rating,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  InputAdornment,
  Grid, 
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse 
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility'; // <--- 1. YANGI IMPORT
import { SelectChangeEvent } from "@mui/material/Select";

// 2. MOCK DATA (views qo'shildi)
const productsData = [
    { id: 1, name: "Wireless Headset Pro", category: "Electronics", price: "$120.00", oldPrice: "$150.00", rating: 4.5, reviews: 34, views: 1200, img: "/img/nike-sneakers.avif"},
    { id: 2, name: "Men's Casual Jacket", category: "Fashion", price: "$85.00", rating: 5.0, reviews: 12, views: 850, img: "/img/winter-coat.webp" },
    { id: 3, name: "Smart Watch Series 7", category: "Electronics", price: "$299.00", oldPrice: "$350.00", rating: 4.0, reviews: 88, views: 3400, img: "/img/winter-coat.webp"},
    { id: 4, name: "Running Sneakers", category: "Fashion", price: "$95.00", rating: 4.5, reviews: 56, views: 1500, img: "/img/classic-bag.webp"},
    { id: 5, name: "Leather Bag", category: "Fashion", price: "$150.00", oldPrice: "$200.00", rating: 5.0, reviews: 21, views: 900, img: "/img/nike-sneakers.avif"},
    { id: 6, name: "Gaming Mouse", category: "Electronics", price: "$45.00", rating: 4.2, reviews: 105, views: 5600, img: "/img/classic-bag.webp"},
    { id: 7, name: "Digital Camera 4K", category: "Electronics", price: "$650.00", rating: 5.0, reviews: 9, views: 230, img: "/img/classic-bag.webp"},
    { id: 8, name: "Modern Sofa", category: "Home", price: "$450.00", oldPrice: "$600.00", rating: 4.6, reviews: 15, views: 450, img: "/img/jacket.webp"},
    { id: 9, name: "Wireless Headset Pro 2", category: "Electronics", price: "$130.00", oldPrice: "$160.00", rating: 4.5, reviews: 34, views: 1100, img: "/img/nike-sneakers.avif"},
    { id: 10, name: "Men's Casual Jacket 2", category: "Fashion", price: "$90.00", rating: 5.0, reviews: 12, views: 780, img: "/img/winter-coat.webp" },
    { id: 11, name: "Smart Watch Series 8", category: "Electronics", price: "$310.00", oldPrice: "$360.00", rating: 4.0, reviews: 88, views: 3100, img: "/img/winter-coat.webp"},
    { id: 12, name: "Running Sneakers 2", category: "Fashion", price: "$100.00", rating: 4.5, reviews: 56, views: 1450, img: "/img/classic-bag.webp"},
    { id: 13, name: "Leather Bag 2", category: "Fashion", price: "$160.00", oldPrice: "$210.00", rating: 5.0, reviews: 21, views: 890, img: "/img/nike-sneakers.avif"},
    { id: 14, name: "Gaming Mouse 2", category: "Electronics", price: "$50.00", rating: 4.2, reviews: 105, views: 5400, img: "/img/classic-bag.webp"},
    { id: 15, name: "Digital Camera 8K", category: "Electronics", price: "$750.00", rating: 5.0, reviews: 9, views: 210, img: "/img/classic-bag.webp"},
    { id: 16, name: "Modern Sofa 2", category: "Home", price: "$550.00", oldPrice: "$700.00", rating: 4.6, reviews: 15, views: 400, img: "/img/jacket.webp"},
  ];

const categories = [
    { name: "All", label: "All Products" },
    { name: "Electronics", label: "Electronics" },
    { name: "Fashion", label: "Fashion" },
    { name: "Home", label: "Home & Living"},
    { name: "Parfum", label: "Parfum"}
];

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8); 
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [onlySale, setOnlySale] = useState(false); 
  const [openCategory, setOpenCategory] = useState(true); 

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(9); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCategory = () => {
    setOpenCategory(!openCategory);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setVisibleCount(9);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const filteredData = productsData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSale = onlySale ? !!item.oldPrice : true;
    
    return matchesCategory && matchesSearch && matchesSale;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));

    if (sortOption === "price-asc") return priceA - priceB;
    if (sortOption === "price-desc") return priceB - priceA;
    return 0; 
  });

  const productsToShow = sortedData.slice(0, visibleCount);

  return (
    <div className="products-page"> 
      <Container maxWidth="xl">
        <Grid container spacing={4}>
            
            {/* SIDEBAR */}
            <Grid size={{xs:12, md:3, lg:2.5 }}>
                <Paper className="sidebar-paper">
                    <Box 
                        onClick={handleToggleCategory} 
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', mb: 2 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                    className="category-item"
                                >
                                    <ListItemText primary={cat.label} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Filter by
                    </Typography>
                    <FormGroup>
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={onlySale} 
                                    onChange={(e) => setOnlySale(e.target.checked)} 
                                />
                            } 
                            label="On Sale" 
                        />
                    </FormGroup>
                </Paper>
            </Grid>

            {/* MAIN CONTENT */}
            <Grid size={{xs:12, md:9, lg:9.5 }}>
                <Paper className="top-filter-bar">
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                         <Typography variant="body1" color="text.secondary">
                            Showing <b>{productsToShow.length}</b> of <b>{filteredData.length}</b> results
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                            <TextField
                                placeholder="Search products..."
                                variant="outlined" size="small"
                                value={searchTerm} onChange={handleSearchChange}
                                sx={{ bgcolor: 'white' }}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
                                }}
                            />
                            <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white' }}>
                                <InputLabel id="sort-select-label">Sort By</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sortOption} label="Sort By"
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value="newest">Newest</MenuItem>
                                    <MenuItem value="price-asc">Low Price</MenuItem>
                                    <MenuItem value="price-desc">High Price</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </Paper>

                {/* PRODUCT GRID */}
                <div className="products-grid-container">
                    {productsToShow.length > 0 ? (
                        productsToShow.map((product, index) => (
                            <div key={`${product.id}-${index}`} className="product-card">
                                
                                <div className="product-image-box">
                                    <img src={product.img} alt={product.name} className="product-img"/>
                                    {product.oldPrice && <span className="sale-badge">SALE</span>}
                                    <IconButton className="like-btn" aria-label="add to favorites">
                                        <FavoriteBorderIcon fontSize="small" />
                                    </IconButton>
                                </div>

                                <div className="product-info">
                                    <Typography className="product-category-text">{product.category}</Typography>
                                    <Typography className="product-name" title={product.name}>
                                        {product.name}
                                    </Typography>

                                    {/* --- 3. YANGILANGAN QISM: Rating va Views --- */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        
                                        {/* Chap tomon: Rating */}
                                        <div className="product-rating" style={{ display: 'flex', alignItems: 'center' }}>
                                            <Rating value={product.rating} precision={0.5} readOnly size="small" />
                                            <span className="review-count" style={{marginLeft: '4px'}}>({product.reviews})</span>
                                        </div>

                                        {/* O'ng tomon: Views */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'black' }}>
                                            <VisibilityIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                {product.views}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {/* ------------------------------------------- */}
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                                        <Typography className="product-price">{product.price}</Typography>
                                        {product.oldPrice && (
                                            <Typography className="old-price">{product.oldPrice}</Typography>
                                        )}
                                    </Box>

                                   <div className="action-buttons">
                                        <Button variant="outlined" className="btn-cart">Add Cart</Button>
                                        <Button variant="contained" className="btn-buy">Buy Now</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 20 }}>
                            <Typography marginLeft={"500px"} variant="h4" color="text.secondary">No products found.</Typography>
                        </Box>
                    )}
                </div>

                {visibleCount < sortedData.length && (
                    <Box className="load-more-container">
                        <Button variant="contained" size="large" onClick={handleLoadMore} sx={{ borderRadius: '30px', px: 5 }}>
                            Load More
                        </Button>
                    </Box>
                )}
            </Grid>
        </Grid>
      </Container>
    </div>
  );
}