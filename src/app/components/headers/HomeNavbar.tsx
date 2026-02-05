import React, { useState } from "react";
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
  ListItemIcon
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { NavLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Logout from "@mui/icons-material/Logout";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'; 


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


export function HomeNavbar() {
  const authUser = true;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebarni ochib-yopish
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

  function handleClose(event: React.MouseEvent<HTMLElement>): void {
    setAnchorEl(null);
  }

  function handleProfileClick(event: React.MouseEvent<HTMLDivElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function handleLogout(event: React.MouseEvent<HTMLLIElement>): void {
    setAnchorEl(null);
  }

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        
        {/* --- 1-QATOR (TOP) --- */}
        <Box className="navbar-top">
          <Box className="logo-box">
            <NavLink to="/">
            <img src="/icons/logo2.png" alt="Fenzo Logo" className="logo-img" />
            </NavLink>
          </Box>
          <Box className="search-box">
             <SearchIcon className="search-icon" />
             <input type="text" placeholder="Search..." className="search-input" />
          </Box>
          {!authUser ? (
            <Box className="action-box">
            <Button variant="contained" className="login-btn">Login</Button>
            <Button variant="contained" className="login-btn">Signup</Button>
          </Box>
          ) : (
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
              <MenuItem onClick={handleClose} className="menu-item">
                <ListItemIcon>
                  <PersonOutlineIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>

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
          )}
        </Box>

        {/* --- 2-QATOR (MENU) --- */}
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
        {/* --- HERO SECTION VA ICHKI SIDEBAR --- */}
        <Box className="hero-section">
           
           {/* --- SHU YERDA SIDEBAR JOYLASHADI --- */}
           {/* Agar sidebarOpen true bo'lsa, bu quti ko'rinadi */}
           {sidebarOpen && (
             <Paper className="category-sidebar-inner" elevation={3}>
                <List>
                  {allCategories.map((text) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={`/products/${text.replace(/\s+/g, "-").toLowerCase()}`}
                        className="category-item"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <ListItemText primary={text} />
                        <ArrowForwardIosIcon sx={{ fontSize: 12, color: "#888" }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

             </Paper>
           )}

           {/* Hero Content (Carousel o'rniga hozircha matn) */}
           <Box className="hero-content-wrapper">
               <Typography variant="h1" className="hero-title">
                  Modern Life Style
               </Typography>
               <Typography variant="h6" className="hero-subtitle">
                  Best quality, Best prices.
               </Typography>
               <Button variant="contained" className="hero-btn">
                  Shop Now
               </Button>
           </Box>

        </Box>

      </Container>
    </div>
  );
}