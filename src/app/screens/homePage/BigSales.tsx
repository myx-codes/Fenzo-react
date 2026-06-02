import React from "react";
import { Container, Box, Typography, Button, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const events = [
  { id: 1, title: "Winter Big Sale 2026",    desc: "Up to 70% off on winter collection",   discount: "70% OFF", date: "Ends Feb 28", img: "/img/winter-coat.webp" },
  { id: 2, title: "Sneakers Festival",        desc: "Limited edition sneakers event",        discount: "80% OFF", date: "Ends Mar 05", img: "/img/Nike-sneakers.avif" },
  { id: 3, title: "Luxury Bag Campaign",      desc: "Premium leather bags promotion",        discount: "85% OFF", date: "Ends Mar 15", img: "/img/classic-bag.webp" },
  { id: 4, title: "Denim Days",               desc: "Best denim deals of the season",        discount: "75% OFF", date: "Ends Mar 20", img: "/img/jacket.webp" },
  { id: 5, title: "Winter Big Sale 2026",    desc: "Up to 70% off on winter collection",   discount: "70% OFF", date: "Ends Feb 28", img: "/img/winter-coat.webp" },
  { id: 6, title: "Sneakers Festival",        desc: "Limited edition sneakers event",        discount: "80% OFF", date: "Ends Mar 05", img: "/img/Nike-sneakers.avif" },
  { id: 7, title: "Luxury Bag Campaign",      desc: "Premium leather bags promotion",        discount: "85% OFF", date: "Ends Mar 15", img: "/img/classic-bag.webp" },
  { id: 8, title: "Denim Days",               desc: "Best denim deals of the season",        discount: "75% OFF", date: "Ends Mar 20", img: "/img/jacket.webp" },
];

export function BigSales() {
  return (
    <div className="events-section">
      <Container maxWidth="xl">
        <div className="lp-section-head">
          <div>
            <Typography className="lp-section-title">Special Events</Typography>
            <Typography className="lp-section-sub">
              Limited-time offers you don't want to miss
            </Typography>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0:    { slidesPerView: 1 },
            768:  { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          className="events-swiper"
        >
          {events.map((ev) => (
            <SwiperSlide key={ev.id}>
              <Box className="event-card">
                <div className="event-img-wrap">
                  <img src={ev.img} alt={ev.title} className="event-img" />
                  <span className="event-badge">{ev.discount}</span>
                  <IconButton className="event-wish-btn">
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                </div>
                <div className="event-body">
                  <Typography className="event-title">{ev.title}</Typography>
                  <Typography className="event-desc">{ev.desc}</Typography>
                  <Typography className="event-date">{ev.date}</Typography>
                  <Button fullWidth className="event-explore-btn">
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