import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NavLink, useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Logout from "@mui/icons-material/Logout";
import Basket from "./Basket";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useGlobals } from "../../hooks/useGlobals";
import { useWishlistContext } from "../../context/WishlistContext";
import { serverApi } from "../../../lib/config";

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
  const { authUser, logout } = useGlobals();
  const { wishlistItems } = useWishlistContext();
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

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    handleClose();
    logout();
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
                  <Badge badgeContent={wishlistItems.length} color="error">
                    <FavoriteBorderIcon sx={{ color: "#fff" }} />
                  </Badge>
                </IconButton>

                {/* Cart – dropdown mini cart (no navigation) */}
                <Basket iconButtonClassName="nav-icon-btn" />

                <Box
                  className="profile-box"
                  onClick={handleProfileClick}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    alt={authUser.userNick}
                    src={authUser.userImage ? `${serverApi}/${authUser.userImage}` : undefined}
                    sx={{ width: 35, height: 35, bgcolor: "#ffca28", color: "#1e3c72" }}
                  >
                    {(authUser.userNick || "U").charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{ elevation: 0, className: "profile-menu-paper" }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClose} className="menu-header">
                    <Avatar
                      className="menu-avatar"
                      src={authUser.userImage ? `${serverApi}/${authUser.userImage}` : undefined}
                    >
                      {(authUser.userNick || "U").charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography className="menu-username">{authUser.userNick}</Typography>
                      <Typography className="menu-email">{authUser.userPhone}</Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <NavLink to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuItem onClick={handleClose} className="menu-item">
                      <ListItemIcon>
                        <PersonOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                  </NavLink>
                  <Divider className="menu-divider" />
                  <MenuItem onClick={handleLogout} className="menu-item logout-item">
                    <ListItemIcon>
                      <Logout fontSize="small" className="logout-icon" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={NavLink} to="/login" variant="contained" className="login-btn">
                  Login
                </Button>
                <Button component={NavLink} to="/signup" variant="contained" className="signup-btn">
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