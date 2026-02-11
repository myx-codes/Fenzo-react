import React from "react";
import { Container, Typography, Avatar, Button, Rating, Box } from "@mui/material";

// Redux va Config importlari
// 1. Selectorlarni to'g'ri import qilamiz
import { retrieveBestProducts, retrieveTopSellers } from "./selector"; 
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config"; 
import { User } from "../../../lib/types/user";

/** REDUX SELECTOR */
// Selector faylidan kelgan funksiyani o'rab olamiz
const topSellerRetriever = createSelector(
  retrieveTopSellers,
  (topSellers) => ({ topSellers })
);


export function TopSellers() {

   // 2. Reduxdan ma'lumotni olamiz
    const { topSellers } = useSelector(topSellerRetriever);
    
    // 3. Xavfsizlik uchun tekshiruv (null kelsa bo'sh array)
    const products = Array.isArray(topSellers) ? topSellers : [];
  return (
    <div className="sellers-section">
      <Container>
        {/* Sarlavha */}
        <Typography variant="h2" className="section-title">
          Top Sellers
        </Typography>

        {/* Grid Container */}
        <div className="sellers-grid">
          {topSellers.map((seller: User
          ) => {
            const imagePath = `${serverApi}/${seller.userImage}`;
            
            return (
              <div key={seller._id} className="seller-card">
              
              {/* 1. Logo (Avatar) */}
              <Avatar 
                src={imagePath} 
                alt={seller.userNick} 
                className="seller-avatar"
              />

              {/* 2. Ism va Followers */}
              <Typography className="seller-name">
                {seller.userNick}
              </Typography>
              {/* <Typography className="follower-count">
                {seller.followers}
              </Typography> */}

              {/* 3. Rating (Yulduzchalar) */}
              <Rating 
                value={seller.userPoints} 
                precision={0.1} 
                readOnly 
                size="small" 
              />

              {/* 4. Tugma */}
              <Button className="visit-btn">
                Visit Store
              </Button>
              
            </div>
            );
           })}
        </div>
      </Container>
    </div>
  );
}