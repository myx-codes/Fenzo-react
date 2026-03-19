import React from "react";
import { Box, Container, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { NavLink } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

export function Footer() {
  const { t } = useGlobals();

  return (
    <div className="footer">
      <Container className="footer-container">
        
        {/* --- YUQORI QISM (4 ta ustun) --- */}
        <Box className="footer-top">
          
          {/* 1. BRAND & HAQIDA */}
          <Box className="footer-col">
            <h2 className="footer-logo">FENZO</h2>
            <p className="footer-desc">
              {t("bestQualityBestPrices")}
            </p>
            <div className="footer-socials">
                <IconButton className="social-btn"><FacebookIcon /></IconButton>
                <IconButton className="social-btn"><InstagramIcon /></IconButton>
                <IconButton className="social-btn"><TwitterIcon /></IconButton>
                <IconButton className="social-btn"><YouTubeIcon /></IconButton>
            </div>
          </Box>

          {/* 2. TEZ LINKLAR */}
          <Box className="footer-col">
            <h3 className="footer-title">{t("quickLinks")}</h3>
            <NavLink to="/" className="footer-link">{t("home")}</NavLink>
            <NavLink to="/products/ELECTRONICS" className="footer-link">{t("electronics")}</NavLink>
            <NavLink to="/products/FASHION" className="footer-link">{t("fashion")}</NavLink>
            <NavLink to="/products/BEAUTY-HEALTH" className="footer-link">{t("accessories")}</NavLink>
            <NavLink to="/products" className="footer-link">{t("newArrivals")}</NavLink>
          </Box>

          {/* 3. MIJOZLAR UCHUN */}
          <Box className="footer-col">
            <h3 className="footer-title">{t("customerCare")}</h3>
            
            {/* 1. My Account to'g'rilandi */}
            <NavLink to="/profile" className="footer-link">
              {t("myAccount")}
            </NavLink>

            {/* 2. Boshqalarni ham NavLink yoki Link ga o'tkazish tavsiya qilinadi */}
            <NavLink to="/orders" className="footer-link">
              {t("orderHistory")}
            </NavLink>
            
            <NavLink to="/track-order" className="footer-link">
              {t("trackOrder")}
            </NavLink>
            
            <NavLink to="/terms" className="footer-link">
              {t("termsAndConditions")}
            </NavLink>
            
            <NavLink to="/privacy" className="footer-link">
              {t("privacyPolicy")}
            </NavLink>
          </Box>

          {/* 4. KONTAKT */}
          <Box className="footer-col">
            <h3 className="footer-title">{t("contactUs")}</h3>
            <p className="footer-text">Bongeunsa-ro 86-gil, Seoul, South Korea</p>
            <p className="footer-text">Email: support@fenzo.uz</p>
            <p className="footer-text">Phone: +821047799495</p>
            
            {/* Newsletter Input (Vizual) */}
            <div className="newsletter-box">
              <input type="email" placeholder={t("yourEmail")} />
                <button>→</button>
            </div>
          </Box>

        </Box>

        {/* --- PASTKI QISM (COPYRIGHT) --- */}
        <Box className="footer-bottom">
          <p>© 2026 FENZO. {t("allRightsReserved")}</p>
            <div className="payment-cards">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>Paypal</span>
            </div>
        </Box>

      </Container>
    </div>
  );
}