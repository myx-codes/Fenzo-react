import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

const stats = [
  {
    value: "25K+",
    label: "Products",
    desc: "Quality items across all categories",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    value: "12K+",
    label: "Happy Customers",
    desc: "Trusted by shoppers every day",
    icon: <PeopleAltOutlinedIcon />,
  },
  {
    value: "3K+",
    label: "Orders Delivered",
    desc: "Fast & reliable deliveries",
    icon: <LocalShippingOutlinedIcon />,
  },
  {
    value: "500+",
    label: "Verified Sellers",
    desc: "Authentic & certified stores",
    icon: <VerifiedOutlinedIcon />,
  },
];

export default function Statistics() {
  return (
    <div className="stats-section">
      <Container maxWidth="xl">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <Box key={i} className="stat-card">
              <div className="stat-icon-wrap">{stat.icon}</div>
              <Typography className="stat-value">{stat.value}</Typography>
              <Typography className="stat-label">{stat.label}</Typography>
              <Typography className="stat-desc">{stat.desc}</Typography>
            </Box>
          ))}
        </div>
      </Container>
    </div>
  );
}