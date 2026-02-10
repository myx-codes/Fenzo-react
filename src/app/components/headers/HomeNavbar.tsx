import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  MenuItem,
  IconButton,
  Badge,
  Avatar,
  Menu,
  ListItemIcon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { NavLink } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Logout from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

// ===== HERO SLIDES =====
const heroSlides = [
  {
    id: 1,
    title: "",
    subtitle: "Best quality, Best prices.",
    btn: "Shop Now",
    image: "/img/image.jpg",
  },
  {
    id: 2,
    title: "",
    subtitle: "Big Sales for Electronics",
    btn: "Explore",
    image: "/img/sale.jpg",
  },
];

// ===== KATEGORIYALAR =====
const allCategories = [
  "Electronics",
  "Computers",
  "Smart Home",
  "Arts & Crafts",
  "Automotive",
  "Baby",
  "Beauty and Personal Care",
  "Women's Fashion",
  "Men's Fashion",
  "Health and Household",
  "Home and Kitchen",
];

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Electronics", path: "/products/electronics" },
  { label: "Men's Fashion", path: "/products/mens-fashion" },
  { label: "Women's Fashion", path: "/products/womens-fashion" },
  { label: "Kids", path: "/products/kids" },
  { label: "Big Sales", path: "/products/big-sales" },
  { label: "Help", path: "/help" },
];

export function HomeNavbar() {
  const authUser = false;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const open = Boolean(anchorEl);

  // ===== HERO CAROUSEL AUTO SLIDE =====
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleClose = () => setAnchorEl(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
  };

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        {/* ===== TOP BAR ===== */}
<Box className="navbar-top">
  <Box className="logo-box">
    <NavLink to="/">
      <img src="/icons/logo2.png" alt="Fenzo Logo" className="logo-img" />
    </NavLink>
  </Box>

  <Box className="search-box">
    <SearchIcon className="search-icon" />
    <input type="text" placeholder="Search" className="search-input" />
  </Box>

  {/* ===== AUTH ACTIONS ===== */}
  {authUser ? (
    <Box className="action-box">
      {/* Like */}
      <IconButton className="nav-icon-btn">
        <FavoriteBorderIcon sx={{ color: "#fff" }} />
      </IconButton>

      {/* Cart */}
      <IconButton className="nav-icon-btn">
        <Badge badgeContent={3} color="secondary">
          <ShoppingCartIcon sx={{ color: "#fff" }} />
        </Badge>
      </IconButton>

      {/* Profile */}
      <Box className="profile-box" onClick={handleProfileClick}>
        <Avatar
          src="/img/yujong.jpg"
          sx={{ width: 35, height: 35 }}
        />
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem>
          <Avatar src="/img/yujong.jpg" />
          <Box ml={1}>
            <Typography>Yujong</Typography>
            <Typography variant="caption">user@example.com</Typography>
          </Box>
        </MenuItem>

        <Divider />

        <MenuItem>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <ShoppingBagOutlinedIcon fontSize="small" />
          </ListItemIcon>
          My Orders
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  ) : (
    /* ===== LOGIN / SIGNUP ===== */
    <Box className="action-box">
        <Button
          component={NavLink}
          to="/home/"
          variant="contained"
          className="login-btn"
        >
          Login
        </Button>

        <Button
          component={NavLink}
          to="/signup"
          variant="contained"
          className="signup-btn"
        >
          Sign Up
        </Button>
      </Box>

  )}
</Box>


        {/* ===== MENU BAR ===== */}
        <Box className="navbar-menu">
          <Button
            className="nav-link sidebar-btn"
            onClick={toggleSidebar}
            startIcon={<MenuIcon />}
          />

          {menuItems.map((item) => (
            <Button
              key={item.label}
              component={NavLink}
              to={item.path}
              className="nav-link"
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* ===== HERO + SIDEBAR ===== */}
        <Box className="hero-section">
          {sidebarOpen && (
            <Paper className="category-sidebar-inner">
              <List>
                {allCategories.map((cat) => (
                  <ListItem key={cat} disablePadding>
                    <ListItemButton
                      component={NavLink}
                      to={`/products/${cat.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <ListItemText primary={cat} />
                      <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* ===== HERO CAROUSEL ===== */}
        </Box>
      </Container>
      <div className="carousel-container">
        <Box
              className="hero-carousel"
            sx={{
              // BU YERDA BALANDLIKNI O'ZGARTIRING
              height: { xs: "400px", md: "400px", lg: "600px" }, 
              backgroundImage: `url(${heroSlides[activeSlide].image})`,
            }}
          >
            <Box className="hero-content-wrapper"
            marginTop={"350px"}
            >
              <Typography variant="h4" className="hero-title">
                {heroSlides[activeSlide].title}
              </Typography>

              <Typography component="div" className="hero-subtitle">
                {heroSlides[activeSlide].subtitle}
              </Typography>

              <Button variant="contained" className="hero-btn">
                {heroSlides[activeSlide].btn}
              </Button>
            </Box>
          </Box>
      </div>
    </div>
  );
}

