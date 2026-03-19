import React from "react";
import { Container, Typography, Avatar, Button, Rating } from "@mui/material";
import { Link } from "react-router-dom";

// Redux va Config importlari
import { retrieveTopSellers } from "./selector";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { User } from "../../../lib/types/user";
import { useDeviceType } from "../../hooks/useDeviceType";

/** REDUX SELECTOR */
// Selector faylidan kelgan funksiyani o'rab olamiz
const topSellerRetriever = createSelector(
  retrieveTopSellers,
  (topSellers) => ({ topSellers })
);


export function TopSellers() {
  const { topSellers } = useSelector(topSellerRetriever);
  const { isTouchLayout, isMobile } = useDeviceType();
  const list = Array.isArray(topSellers) ? topSellers : [];

  return (
    <div className="sellers-section">
      <Container>
        <Typography variant="h2" className="section-title">
          Top Sellers
        </Typography>
        <div className={isTouchLayout ? "sellers-track" : "sellers-grid"}>
          {list.map((seller: User) => {
            const imagePath = `${serverApi}/${seller.userImage}`;
            const sellerId = seller._id || (seller as any).userId;
            if (!sellerId) return null;
            const sellerPath = `/user/seller/${sellerId}`;
            return (
              <div
                key={String(sellerId)}
                className={`seller-card ${isTouchLayout ? "seller-card-mobile" : ""}`.trim()}
              >
                <Avatar
                  src={imagePath}
                  alt={seller.userNick}
                  className="seller-avatar"
                />
                <Typography className="seller-name">
                  {seller.userNick}
                </Typography>
                <Rating
                  value={seller.userPoints}
                  precision={0.1}
                  readOnly
                  size={isMobile ? "small" : "medium"}
                />
                <Button
                  component={Link}
                  to={sellerPath}
                  className="visit-btn"
                  style={{ textDecoration: "none" }}
                >
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