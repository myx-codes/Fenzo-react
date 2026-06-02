import React from "react";
import { Container, Typography, Avatar, Button, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { retrieveTopSellers } from "./selector";
import { serverApi } from "../../../lib/config";
import { User } from "../../../lib/types/user";
import { useDeviceType } from "../../hooks/useDeviceType";

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
      <Container maxWidth="xl">
        <div className="lp-section-head">
          <div>
            <Typography className="lp-section-title">Top Sellers</Typography>
            <Typography className="lp-section-sub">
              Verified stores with the highest ratings
            </Typography>
          </div>
          <Button
            component={Link}
            to="/products/ALL"
            className="lp-see-all-btn"
          >
            View all →
          </Button>
        </div>

        <div className={isTouchLayout ? "sellers-scroll" : "sellers-grid"}>
          {list.map((seller: User) => {
            const imagePath = `${serverApi}/${seller.userImage}`;
            const sellerId = seller._id || (seller as any).userId;
            if (!sellerId) return null;
            return (
              <div key={String(sellerId)} className="seller-card">
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
                  sx={{ "& .MuiRating-iconFilled": { color: "var(--gold)" } }}
                />
                <Button
                  component={Link}
                  to={`/user/seller/${sellerId}`}
                  className="visit-btn"
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