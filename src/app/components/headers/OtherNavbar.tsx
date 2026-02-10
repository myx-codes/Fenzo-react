import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'; 

import { NavLink } from "react-router-dom";

// KATEGORIYALAR
const allCategories = [
  "Electronics", "Computers", "Smart Home", "Arts & Crafts", 
  "Automotive", "Baby", "Beauty and Personal Care", "Women's Fashion",
  "Men's Fashion", "Health and Household", "Home and Kitchen"
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

export function OtherNavbar() {
  // Profil menyusini ochish/yopish uchun state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Logout logikasi shu yerda bo'ladi
    handleClose();
    console.log("Logged out");
  };

  return (
    <div className="other-navbar">
      <Container className="navbar-container">
        
        {/* --- 1-QATOR: LOGO | SEARCH | USER ACTIONS --- */}
        <Box className="navbar-top">
          
          {/* Logo (HomeNavbar bilan bir xil) */}
          <Box className="logo-box">
            <NavLink to="/">
            <img src="/icons/logo2.png" alt="Fenzo Logo" className="logo-img" />
            </NavLink>
          </Box>

          {/* Search Box (HomeNavbar bilan bir xil) */}
          <Box className="search-box">
             <SearchIcon className="search-icon" />
             <input 
               type="text" 
               placeholder="Search products..." 
               className="search-input" 
             />
          </Box>

          {/* USER ACTIONS (Login o'rniga shu qism chiqadi) */}
          <Box className="action-box">
            
            {/* Sevimlilar (Like) */}
            <IconButton className="nav-icon-btn">
                <FavoriteBorderIcon style={{ color: 'white' }} />
            </IconButton>

            {/* Savatcha (Basket) */}
            <IconButton className="nav-icon-btn">
              <Badge badgeContent={3} color="secondary">
                <ShoppingCartIcon style={{ color: 'white' }} />
              </Badge>
            </IconButton>

            {/* Profil tugmasi */}
            <Box 
                className="profile-box" 
                onClick={handleProfileClick}
            >
                <Avatar 
                    alt="User Name" 
                    src="/img/yujong.jpg" // Agar rasm bo'lmasa harf chiqadi
                    sx={{ width: 35, height: 35, bgcolor: '#ffca28', color: '#1e3c72' }}
                >
                    U
                </Avatar>
            </Box>

            {/* Profil Menyusi (Dropdown) */}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                className: "profile-menu-paper", // Asosiy klass
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* Header */}
              <MenuItem onClick={handleClose} className="menu-header">
                <Avatar 
                className="menu-avatar"
                src="/img/yujong.jpg" 
                 />
                <Box>
                    <Typography className="menu-username">Yujong</Typography>
                    <Typography className="menu-email">user@example.com</Typography>
                </Box>
              </MenuItem>

              <Divider />

              {/* Items */}
              <NavLink to="/profile">
                <MenuItem onClick={handleClose} className="menu-item">
                  <ListItemIcon>
                    <PersonOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
              </NavLink>

              <MenuItem onClick={handleClose} className="menu-item">
                <ListItemIcon>
                  <Badge badgeContent={2} color="error" className="menu-badge">
                    <ShoppingBagOutlinedIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                My Orders
              </MenuItem>

              {/* ... Settings ... */}

              <Divider className="menu-divider" />

              {/* Logout */}
              <MenuItem onClick={handleLogout} className="menu-item logout-item">
                <ListItemIcon>
                  <Logout fontSize="small" className="logout-icon" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>

          </Box>
        
        </Box>

        {/* --- 2-QATOR: MENU LINKS --- */}
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
      </Container>
    </div>
  );
}