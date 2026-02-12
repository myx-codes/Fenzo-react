import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NavLink, useHistory } from "react-router-dom";
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

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products/ALL" },
  { label: "Electronics", path: "/products/ELECTRONICS" },
  { label: "Beauty & Health", path: "/products/BEAUTY-HEALTH" },
  { label: "Fashion", path: "/products/FASHION" },
  { label: "Kids", path: "/products/KIDS" },
  { label: "Help", path: "/help" }, 
];

export function HomeNavbar() {
  const authUser = true; 

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

  const handleClose = () => setAnchorEl(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
  };

  // Global searching
  const history = useHistory();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        
        {/* ===== TOP BAR (Logo, Search, Auth) ===== */}
        <Box className="navbar-top">
          <Box className="logo-box">
            <NavLink to="/">
              <img src="/icons/logo2.png" alt="Fenzo Logo" className="logo-img" />
            </NavLink>
          </Box>

          <Box className="search-box">
            <SearchIcon className="search-icon" />
            <input 
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    history.push(`/products/ALL?search=${searchValue}`);
                  }
                }}
              />
          </Box>

          {/* ===== AUTH ACTIONS ===== */}
          <Box className="action-box">
            {authUser ? (
              <>
                {/* Like → Wishlist */}
                <IconButton className="nav-icon-btn" component={NavLink} to="/profile?tab=wishlist">
                  <FavoriteBorderIcon sx={{ color: "#fff" }} />
                </IconButton>

                {/* Cart */}
                <IconButton className="nav-icon-btn">
                  <Badge badgeContent={3} color="secondary">
                    <ShoppingCartIcon sx={{ color: "#fff" }} />
                  </Badge>
                </IconButton>

                {/* Profile */}
                <Box className="profile-box" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                  <Avatar
                    src="/img/yujong.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                </Box>

                {/* Profile Menu Dropdown */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar src="/img/yujong.jpg" sx={{ marginRight: 1 }} />
                    <Box>
                      <Typography variant="subtitle2">Yujong</Typography>
                      <Typography variant="caption" color="textSecondary">user@example.com</Typography>
                    </Box>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>

                  <MenuItem onClick={handleClose}>
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
              </>
            ) : (
              /* ===== GUEST (LOGIN / SIGNUP) ===== */
              <>
                <Button
                  component={NavLink}
                  to="/login"
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
              </>
            )}
          </Box>
        </Box>

        {/* ===== MENU BAR (Sidebar tugmasi yo'q) ===== */}
        <Box className="navbar-menu">
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

      </Container>

      {/* ===== HERO CAROUSEL ===== */}
      <div className="carousel-container">
        <Box
          className="hero-carousel"
          sx={{
            height: { xs: "400px", md: "400px", lg: "600px" },
            backgroundImage: `url(${heroSlides[activeSlide].image})`,
          }}
        >
          <Box className="hero-content-wrapper" marginTop={"350px"}>
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