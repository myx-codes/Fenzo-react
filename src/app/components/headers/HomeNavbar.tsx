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
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { NavLink } from "react-router-dom";

// KATEGORIYALAR
const allCategories = [
  "Electronics", "Computers", "Smart Home", "Arts & Crafts", 
  "Automotive", "Baby", "Beauty and Personal Care", "Women's Fashion",
  "Men's Fashion", "Health and Household", "Home and Kitchen"
];

export function HomeNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebarni ochib-yopish
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        
        {/* --- 1-QATOR (TOP) --- */}
        <Box className="navbar-top">
          <Box className="logo-box">
            <NavLink to="/">
            <img src="/icons/fenzoLogo.png" alt="Fenzo Logo" className="logo-img" />
            </NavLink>
          </Box>
          <Box className="search-box">
             <SearchIcon className="search-icon" />
             <input type="text" placeholder="Search..." className="search-input" />
          </Box>
          <Box className="action-box">
            <Button variant="contained" className="login-btn">Login</Button>
            <Button variant="contained" className="login-btn">Signup</Button>
          </Box>
        </Box>

        {/* --- 2-QATOR (MENU) --- */}
        <Box className="navbar-menu">
          {/* SIDEBAR TUGMASI */}
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