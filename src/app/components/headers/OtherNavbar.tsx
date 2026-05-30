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
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Basket from "./Basket";
import Logout from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { NavLink, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { useWishlistContext } from "../../context/WishlistContext";
import { serverApi } from "../../../lib/config";
import { languageCodes, languageOptions, SupportedLanguage } from "../../i18n/translations";

export function OtherNavbar() {
  const { authUser, logout, language, setLanguage, t } = useGlobals();
  const { wishlistItems } = useWishlistContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const [searchValue, setSearchValue] = useState("");
  const handleSearchSubmit = () => {
    const encoded = encodeURIComponent(searchValue.trim());
    history.push(`/products/ALL?q=${encoded}`);
  };

  const menuItems = [
    { label: t("home"), path: "/" },
    { label: t("products"), path: "/products/ALL" },
    { label: t("electronics"), path: "/products/ELECTRONICS" },
    { label: t("beautyHealth"), path: "/products/BEAUTY-HEALTH" },
    { label: t("fashion"), path: "/products/FASHION" },
    { label: t("kids"), path: "/products/KIDS" },
    { label: t("help"), path: "/help" },
  ];

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
              placeholder="red shoes under 50 newest"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
            />
          </Box>

          <Box className="action-box">
            <Box className="language-control">
              <LanguageIcon className="language-icon" fontSize="small" />
              <Select
                aria-label={t("language")}
                className="lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                renderValue={(selected) => languageCodes[selected as SupportedLanguage]}
                size="small"
              >
                {languageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {authUser ? (
              <>
                <IconButton className="nav-icon-btn" component={NavLink} to="/profile?tab=wishlist">
                  <Badge badgeContent={wishlistItems.length} color="error">
                    <FavoriteBorderIcon style={{ color: "white" }} />
                  </Badge>
                </IconButton>
                <Basket iconButtonClassName="nav-icon-btn" />
                <Box className="profile-box" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
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
                      {t("profile")}
                    </MenuItem>
                  </NavLink>
                  <Divider className="menu-divider" />
                  <MenuItem onClick={handleLogout} className="menu-item logout-item">
                    <ListItemIcon>
                      <Logout fontSize="small" className="logout-icon" />
                    </ListItemIcon>
                    {t("logout")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={NavLink} to="/login" variant="contained" className="login-btn">
                  {t("login")}
                </Button>
                <Button component={NavLink} to="/signup" variant="contained" className="signup-btn">
                  {t("signUp")}
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Box className="navbar-menu">
          {menuItems.map((item) => (
            <Button key={item.label} component={NavLink} to={item.path} className="nav-link">
              {item.label}
            </Button>
          ))}
        </Box>
      </Container>
    </div>
  );
}
