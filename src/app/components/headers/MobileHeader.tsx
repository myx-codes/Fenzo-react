import React from "react";
import { AppBar, Toolbar, Box, IconButton, Badge, Button, Select, MenuItem } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LanguageIcon from "@mui/icons-material/Language";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { useWishlistContext } from "../../context/WishlistContext";
import { useGlobals } from "../../hooks/useGlobals";
import { languageOptions, SupportedLanguage } from "../../i18n/translations";

const languageCodes: Record<SupportedLanguage, string> = {
  en: "EN",
  uz: "UZ",
  ko: "KO",
};

export function MobileHeader() {
  const { wishlistItems } = useWishlistContext();
  const { authUser, language, setLanguage, t } = useGlobals();
  return (
    <AppBar position="sticky" className="mobile-appbar" elevation={0}>
      <Toolbar className="mobile-toolbar">
        <Box className="mobile-logo-wrap" component={NavLink} to="/">
          <img src="/icons/logo2.png" alt="Fenzo" className="mobile-logo" />
        </Box>

        <Box className="mobile-actions">
          <Box className="mobile-language-control">
            <LanguageIcon className="mobile-language-icon" fontSize="small" />
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              renderValue={(selected) => languageCodes[selected as SupportedLanguage]}
              size="small"
              className="mobile-lang-select"
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
              <IconButton color="inherit" component={NavLink} to="/profile?tab=wishlist" aria-label="wishlist">
                <Badge badgeContent={wishlistItems.length} color="error">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
              <Basket />
            </>
          ) : (
            <>
              <Button
                component={NavLink}
                to="/login"
                variant="contained"
                className="mobile-auth-btn mobile-login-btn"
              >
                {t("login")}
              </Button>
              <Button
                component={NavLink}
                to="/signup"
                variant="contained"
                className="mobile-auth-btn mobile-signup-btn"
              >
                {t("signUp")}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
