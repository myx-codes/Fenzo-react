import React from "react";
import { Box, Container, Stack, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

export function Footer() {
  return (
    <div className="footer">
      <Container className="footer-container">
        
        {/* --- YUQORI QISM (4 ta ustun) --- */}
        <Box className="footer-top">
          
          {/* 1. BRAND & HAQIDA */}
          <Box className="footer-col">
            <h2 className="footer-logo">FENZO</h2>
            <p className="footer-desc">
              Bizning do'konimizda eng so'nggi rusumdagi elektronika va moda 
              mahsulotlarini topishingiz mumkin. Sifat va hamyonbop narxlar kafolati.
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
            <h3 className="footer-title">Quick Links</h3>
            <a href="#" className="footer-link">Home</a>
            <a href="#" className="footer-link">Electronics</a>
            <a href="#" className="footer-link">Fashion</a>
            <a href="#" className="footer-link">Accessories</a>
            <a href="#" className="footer-link">New Arrivals</a>
          </Box>

          {/* 3. MIJOZLAR UCHUN */}
          <Box className="footer-col">
            <h3 className="footer-title">Customer Care</h3>
            <a href="#" className="footer-link">My Account</a>
            <a href="#" className="footer-link">Order History</a>
            <a href="#" className="footer-link">Track Order</a>
            <a href="#" className="footer-link">Terms & Conditions</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </Box>

          {/* 4. KONTAKT */}
          <Box className="footer-col">
            <h3 className="footer-title">Contact Us</h3>
            <p className="footer-text">123 Street, Tashkent, Uzbekistan</p>
            <p className="footer-text">Email: support@fenzo.uz</p>
            <p className="footer-text">Phone: +998 90 123 45 67</p>
            
            {/* Newsletter Input (Vizual) */}
            <div className="newsletter-box">
                <input type="email" placeholder="Your email..." />
                <button>→</button>
            </div>
          </Box>

        </Box>

        {/* --- PASTKI QISM (COPYRIGHT) --- */}
        <Box className="footer-bottom">
            <p>© 2024 FENZO. All rights reserved.</p>
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