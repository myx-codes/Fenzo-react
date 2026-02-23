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
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Basket from "./Basket";
import Logout from "@mui/icons-material/Logout";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'; 
import { NavLink, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { useWishlistContext } from "../../context/WishlistContext";
import { serverApi } from "../../../lib/config";






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
  const { authUser, logout } = useGlobals();
  const { wishlistItems } = useWishlistContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const [searchValue, setSearchValue] = useState("");

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
  };

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
            {authUser ? (
              <>
                <IconButton className="nav-icon-btn" component={NavLink} to="/profile?tab=wishlist">
                  <Badge badgeContent={wishlistItems.length} color="error">
                    <FavoriteBorderIcon style={{ color: 'white' }} />
                  </Badge>
                </IconButton>
                <Basket iconButtonClassName="nav-icon-btn" />
                <Box
                  className="profile-box"
                  onClick={handleProfileClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar
                    alt={authUser.userNick}
                    src={authUser.userImage ? `${serverApi}/${authUser.userImage}` : undefined}
                    sx={{ width: 35, height: 35, bgcolor: '#ffca28', color: '#1e3c72' }}
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
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
                <Basket iconButtonClassName="nav-icon-btn" />
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



