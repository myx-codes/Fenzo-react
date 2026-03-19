import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { useDeviceType } from "../../hooks/useDeviceType";

// FENZO MARKETPLACE STATISTIKALARI
const staticStats = [
  { 
    id: 1, 
    value: "25K+", 
    label: "Products", 
    desc: "Quality products across all major categories on Fenzo" 
  },
  { 
    id: 2, 
    value: "12K+", 
    label: "Happy Customers", 
    desc: "Trusted by customers shopping daily on our marketplace" 
  },
  { 
    id: 3, 
    value: "3K+", 
    label: "Orders Delivered", 
    desc: "Successful deliveries completed with fast shipping" 
  },
  { 
    id: 4, 
    value: "500+", 
    label: "Verified Sellers", 
    desc: "Trusted sellers providing original and authentic products" 
  },
];

export default function Statistics() {
  const { isMobile } = useDeviceType();

  if (isMobile) return null;

  return (
    <div className="stats-section">
      <Container>
        <div className="stats-grid-wrapper">
          {staticStats.map((stat) => (
            <Box key={stat.id} className="stat-item">
              
              {/* Katta raqam */}
              <Typography component="div" className="stat-value">
                {stat.value}
              </Typography>

              {/* Label */}
              <Typography variant="h6" className="stat-label">
                {stat.label}
              </Typography>

              {/* Izoh */}
              <Typography variant="body2" className="stat-desc">
                {stat.desc}
              </Typography>

            </Box>
          ))}
        </div>
      </Container>
    </div>
  );
}
