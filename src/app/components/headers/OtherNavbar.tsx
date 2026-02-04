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
  ListItemText
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { NavLink } from "react-router-dom";

// KATEGORIYALAR
const allCategories = [
  "Electronics", "Computers", "Smart Home", "Arts & Crafts", 
  "Automotive", "Baby", "Beauty and Personal Care", "Women's Fashion",
  "Men's Fashion", "Health and Household", "Home and Kitchen"
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
            <img src="/icons/fenzoLogo.png" alt="Fenzo Logo" className="logo-img" />
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
                    src="/img/avatar.png" // Agar rasm bo'lmasa harf chiqadi
                    sx={{ width: 35, height: 35, bgcolor: '#ffca28', color: '#1e3c72' }}
                >
                    U
                </Avatar>
            </Box>

            {/* Profil Menyusi (Dropdown) */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>
                <PersonIcon style={{ marginRight: '10px', color: '#666' }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Badge badgeContent={2} color="error" style={{ marginRight: '15px' }}>
                    <ShoppingCartIcon style={{ color: '#666' }} />
                </Badge> 
                My Orders
              </MenuItem>
              <MenuItem onClick={handleLogout} style={{ color: 'red' }}>
                <Logout style={{ marginRight: '10px' }} /> Logout
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
          >
          </Button>
          {["Home", "Electronics", "hdoiwhd",  "dhoqhfo", "dhoqhfo",  "Fashion", "Help"].map((item) => (
            <Button key={item} className="nav-link">{item}</Button>
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
                      <ListItemButton className="category-item">
                        <ListItemText primary={text} />
                        <ArrowForwardIosIcon style={{ fontSize: '12px', color: '#888' }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
             </Paper>
           )}
        </Box>

      </Container>
    </div>
  );
}