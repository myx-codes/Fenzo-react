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
  ListItemIcon,
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Basket from "./Basket";
import Logout from "@mui/icons-material/Logout";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'; 
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";






const menuItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products/ALL" },
  { label: "Electronics", path: "/products/ELECTRONICS" },
  { label: "Beauty & Health", path: "/products/BEAUTY-HEALTH" },
  { label: "Fashion", path: "/products/FASHION" },
  { label: "Kids", path: "/products/KIDS" },
  { label: "Help", path: "/help" }, 
];

export function OtherNavbar() {
  // Profil menyusini ochish/yopish uchun state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // SIDEBAR KODLARI OLIB TASHLANDI

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    console.log("Logged out");
  };
  // Global searching
  const history = useHistory();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="other-navbar">
      <Container className="navbar-container">
        
        {/* --- 1-QATOR: LOGO | SEARCH | USER ACTIONS --- */}
        <Box className="navbar-top">
          
          {/* Logo */}
          <Box className="logo-box">
            <NavLink to="/">
              <img src="/icons/logo2.png" alt="Fenzo Logo" className="logo-img" />
            </NavLink>
          </Box>

          {/* Search Box */}
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

          {/* USER ACTIONS */}
          <Box className="action-box">
            
            {/* Wishlist */}
            <IconButton className="nav-icon-btn" component={NavLink} to="/profile?tab=wishlist">
              <FavoriteBorderIcon style={{ color: 'white' }} />
            </IconButton>

            {/* Cart – dropdown mini cart (no navigation) */}
            <Basket iconButtonClassName="nav-icon-btn" />

            {/* Profil tugmasi */}
            <Box 
                className="profile-box" 
                onClick={handleProfileClick}
                style={{ cursor: 'pointer' }}
            >
                <Avatar 
                    alt="User Name" 
                    src="/img/yujong.jpg" 
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
                className: "profile-menu-paper",
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
              <NavLink to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
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

        {/* --- 2-QATOR: MENU LINKS (Sidebar tugmasi olib tashlandi) --- */}
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
    </div>
  );
}



