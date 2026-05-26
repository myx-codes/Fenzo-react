import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const events = [
  {
    id: 1,
    title: "Winter Big Sale 2026",
    description: "Up to 70% off on winter collection",
    discount: "70% OFF",
    date: "Ends Feb 28",
    img: "/img/winter-coat.webp",
  },
  {
    id: 2,
    title: "Sneakers Festival",
    description: "Limited edition sneakers event",
    discount: "80% OFF",
    date: "Ends Mar 05",
    img: "/img/Nike-sneakers.avif",
  },
  {
    id: 3,
    title: "Luxury Bag Campaign",
    description: "Premium leather bags promotion",
    discount: "85% OFF",
    date: "Ends Mar 15",
    img: "/img/classic-bag.webp",
  },
  {
    id: 4,
    title: "Denim Days",
    description: "Best denim deals of the season",
    discount: "75% OFF",
    date: "Ends Mar 20",
    img: "/img/jacket.webp",
  },
  {
    id: 5,
    title: "Winter Big Sale 2026",
    description: "Up to 70% off on winter collection",
    discount: "70% OFF",
    date: "Ends Feb 28",
    img: "/img/winter-coat.webp",
  },
  {
    id: 6,
    title: "Sneakers Festival",
    description: "Limited edition sneakers event",
    discount: "80% OFF",
    date: "Ends Mar 05",
    img: "/img/Nike-sneakers.avif",
  },
  {
    id: 7,
    title: "Luxury Bag Campaign",
    description: "Premium leather bags promotion",
    discount: "85% OFF",
    date: "Ends Mar 15",
    img: "/img/classic-bag.webp",
  },
  {
    id: 8,
    title: "Denim Days",
    description: "Best denim deals of the season",
    discount: "75% OFF",
    date: "Ends Mar 20",
    img: "/img/jacket.webp",
  },
];

export function BigSales() {
  return (
    <div className="events-section">
      <Container>
        <Typography variant="h2" className="events-title">
          Special Events
        </Typography>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <Box className="event-card">
                <div className="event-image-box">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="event-img"
                  />

                  <span className="event-badge">
                    {event.discount}
                  </span>

                  <IconButton className="event-like-btn">
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                </div>

                <div className="event-info">
                  <Typography className="event-title">
                    {event.title}
                  </Typography>

                  <Typography className="event-desc">
                    {event.description}
                  </Typography>

                  <Typography className="event-date">
                    {event.date}
                  </Typography>

                  <Button
                    variant="outlined" fullWidth className="btn-buy"
                  >
                    Explore Event
                  </Button>
                </div>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
}
