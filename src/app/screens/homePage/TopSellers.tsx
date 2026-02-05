import React from "react";
import { Container, Typography, Avatar, Button, Rating, Box } from "@mui/material";

// Static Data: Top Sotuvchilar
const topSellers = [
  {
    id: 1,
    name: "Fashion Hub",
    logo: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.8,
    followers: "12.5k Followers",
  },
  {
    id: 2,
    name: "Tech World",
    logo: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 5.0,
    followers: "45k Followers",
  },
  {
    id: 3,
    name: "Green Organic",
    logo: "https://images.pexels.com/photos/1089932/pexels-photo-1089932.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.5,
    followers: "8k Followers",
  },
  {
    id: 4,
    name: "Urban Style",
    logo: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.2,
    followers: "20k Followers",
  },
];

export function TopSellers() {
  return (
    <div className="sellers-section">
      <Container>
        {/* Sarlavha */}
        <Typography variant="h2" className="section-title">
          Top Sellers
        </Typography>

        {/* Grid Container */}
        <div className="sellers-grid">
          {topSellers.map((seller) => (
            <div key={seller.id} className="seller-card">
              
              {/* 1. Logo (Avatar) */}
              <Avatar 
                src={seller.logo} 
                alt={seller.name} 
                className="seller-avatar"
              />

              {/* 2. Ism va Followers */}
              <Typography className="seller-name">
                {seller.name}
              </Typography>
              <Typography className="follower-count">
                {seller.followers}
              </Typography>

              {/* 3. Rating (Yulduzchalar) */}
              <Rating 
                value={seller.rating} 
                precision={0.1} 
                readOnly 
                size="small" 
              />

              {/* 4. Tugma */}
              <Button className="visit-btn">
                Visit Store
              </Button>
              
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}