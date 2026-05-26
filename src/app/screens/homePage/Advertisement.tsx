import React from "react";
import { Box, Typography } from "@mui/material";


const videoSrc = `/video/apple-watch-h264.mp4`;
export default function Advertisement() {
  return (
    <div className="ad-section">
      
      {/* 1. Orqa fon videosi */}
      <video 
        className="ad-video" 
        autoPlay 
        loop 
        muted // Brauzerlar avtomatik o'ynashga ruxsat berishi uchun ovozsiz bo'lishi shart
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* 2. Qoramtir parda (Overlay) */}
      <div className="ad-overlay"></div>

      {/* 3. Yozuv va Tugma */}
      <Box className="ad-content">
        <Typography variant="h1" className="ad-title">
          {/* New Collection 2024 */}
        </Typography>
        
        <Typography variant="h6" className="ad-subtitle">
          {/* Experience the comfort and style tailored just for you. 
          Limited edition available now. */}
        </Typography>
      </Box>
      
    </div>
  );
}