import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Container, 
  Box, 
  Stack, 
  Typography, 
  Grid, 
  Avatar, 
  Button, 
  Tab, 
  Tabs, 
  Card, 
  Divider, 
  Chip,
  IconButton,
  Rating 
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // <--- O'chirish ikonkasi

// ... (MOCK DATA o'zgarishsiz qoladi) ...
const orderHistory = [
  { id: "#ORD-7741", date: "12 Feb, 2024", total: "$250.00", status: "Delivered", items: [{ name: "Wireless Headset Pro", img: "/img/nike-sneakers.avif", price: "$120", qty: 1 }] },
];

const wishlistItems = [
  { id: 1, name: "Winter Coat Elegant", price: "$85.00", oldPrice: "$120.00", rating: 4.5, reviews: 12, views: 1240, img: "/img/winter-coat.webp" },
  { id: 2, name: "Casual Denim Jacket", price: "$55.00", rating: 4.0, reviews: 8, views: 850, img: "/img/jacket.webp" },
  { id: 3, name: "Classic Leather Bag", price: "$140.00", oldPrice: "$180.00", rating: 5.0, reviews: 25, views: 3200, img: "/img/classic-bag.webp" },
  { id: 4, name: "Running Sneakers", price: "$95.00", rating: 4.5, reviews: 40, views: 560, img: "/img/nike-sneakers.avif" },
];

const user = {
    name: "Akmal Juraev",
    email: "akmal@example.com",
    phone: "+998 90 123 45 67",
    address: "Tashkent, Uzbekistan, Chilanzar 12",
    avatar: "/img/user-avatar.jpg" 
};

export function MyPage() {
  const location = useLocation();
  const tabFromUrl = new URLSearchParams(location.search).get("tab");
  const [tabValue, setTabValue] = useState(tabFromUrl === "wishlist" ? "wishlist" : "orders");

  useEffect(() => {
    if (tabFromUrl === "wishlist") setTabValue("wishlist");
  }, [tabFromUrl]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
        case "Delivered": return "success";
        case "Processing": return "info";
        case "Cancelled": return "error";
        default: return "default";
    }
  };

  const removeFromWishlist = (id: number) => {
    console.log("Removing item id:", id);
    // Backend logic...
  };

  return (
    <div className="my-page">
      <Container>
        <Stack className="my-page-title">
            <Typography variant="h2">My Account</Typography>
        </Stack>

        <Grid container spacing={4}>
          
          {/* --- LEFT SIDEBAR --- */}
           <Grid size={{xs:12, md:4, lg:3 }}>
            <Card className="user-sidebar-card">
                <Box className="user-avatar-box">
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 100, height: 100, fontSize: 40 }}>{user.name.charAt(0)}</Avatar>
                    <Typography variant="h5" className="user-name">{user.name}</Typography>
                    <Typography variant="body2" className="user-email">{user.email}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box className="user-menu">
                    <Tabs orientation="vertical" value={tabValue} onChange={handleTabChange} sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }} TabIndicatorProps={{ style: { display: "none" } }}>
                        <Tab label="My Orders" value="orders" icon={<LocalMallIcon />} iconPosition="start" className={tabValue === 'orders' ? 'active-tab' : ''}/>
                        <Tab label="Wishlist" value="wishlist" icon={<FavoriteIcon />} iconPosition="start" className={tabValue === 'wishlist' ? 'active-tab' : ''}/>
                        <Tab label="Personal Info" value="info" icon={<PersonIcon />} iconPosition="start" className={tabValue === 'info' ? 'active-tab' : ''}/>
                        <Tab label="Address" value="address" icon={<LocationOnIcon />} iconPosition="start" className={tabValue === 'address' ? 'active-tab' : ''}/>
                    </Tabs>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />}>Log Out</Button>
                </Box>
            </Card>
          </Grid>

          {/* --- RIGHT CONTENT --- */}
           <Grid size={{xs:12, md:8, lg:9 }}>
             
             {/* 1. ORDERS TAB */}
             {tabValue === "orders" && (
                <Stack spacing={3}>
                    <Typography variant="h4" sx={{ mb: 1 }}>Order History</Typography>
                    {orderHistory.map((order) => (
                        <Card key={order.id} className="order-card">
                            <Box className="order-header">
                                <Box>
                                    <Typography variant="h6" className="order-id">Order {order.id}</Typography>
                                    <Typography variant="body2" color="text.secondary">Placed on {order.date}</Typography>
                                </Box>
                                <Chip label={order.status} color={getStatusColor(order.status) as any} variant="outlined" size="small" />
                            </Box>
                            <Divider />
                            <Box className="order-items-box">
                                {order.items.map((item, index) => (
                                    <Box key={index} className="order-item">
                                        <img src={item.img} alt={item.name} className="order-item-img" />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">Qty: {item.qty}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.price}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Divider />
                            <Box className="order-footer">
                                <Typography>Total Amount:</Typography>
                                <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>{order.total}</Typography>
                            </Box>
                        </Card>
                    ))}
                </Stack>
             )}

             {/* 2. WISHLIST TAB */}
             {tabValue === "wishlist" && (
                <Stack spacing={3}>
                    <Typography variant="h4" sx={{ mb: 1 }}>My Wishlist</Typography>
                    
                    <div className="products-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                        {wishlistItems.map((item) => (
                           <div key={item.id} className="product-card">
                                
                                <div className="product-image-box">
                                    <img src={item.img} alt={item.name} className="product-img"/>
                                    {item.oldPrice && <span className="sale-badge">SALE</span>}
                                    
                                    {/* Yuqori o'ng burchakdagi Yurak (Like) */}
                                    <IconButton 
                                        className="like-btn" 
                                        sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#ffebee' } }}
                                    >
                                        <FavoriteIcon sx={{ color: 'red' }} fontSize="small" />
                                    </IconButton>
                                </div>

                                <div className="product-info">
                                    <Typography className="product-name" title={item.name}>{item.name}</Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <div className="product-rating" style={{ display: 'flex', alignItems: 'center' }}>
                                            <Rating value={item.rating} precision={0.5} readOnly size="small" />
                                            <span className="review-count" style={{marginLeft: '4px'}}>({item.reviews})</span>
                                        </div>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                            <VisibilityIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{item.views}</Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                                        <Typography className="product-price">{item.price}</Typography>
                                        {item.oldPrice && <Typography className="old-price">{item.oldPrice}</Typography>}
                                    </Box>

                                    {/* --- 3. Add to Cart va Delete tugmalari --- */}
                                   <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                                        {/* Add to Cart - ko'proq joy egallaydi */}
                                        <Button 
                                            variant="outlined" 
                                            className="btn-cart" 
                                            sx={{ flex: 1 }}
                                        >
                                            Add to Cart
                                        </Button>

                                        {/* Delete - kichik kvadrat tugma */}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeFromWishlist(item.id)}
                                            sx={{ minWidth: '40px', px: 1, borderColor: '#ffcdd2', color: '#d32f2f', '&:hover': { borderColor: '#d32f2f', bgcolor: '#ffebee' } }}
                                        >
                                            <DeleteOutlineIcon />
                                        </Button>
                                    </div>
                                    {/* -------------------------------------- */}

                                </div>
                            </div>
                        ))}
                    </div>
                </Stack>
             )}

             {/* 3. INFO TAB */}
             {tabValue === "info" && (
                <Card sx={{ p: 4, borderRadius: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Personal Information</Typography>
                    <Typography paragraph>Edit your name, email and phone number here.</Typography>
                    <Button variant="contained">Save Changes</Button>
                </Card>
             )}

              {/* 4. ADDRESS TAB */}
             {tabValue === "address" && (
                <Card sx={{ p: 4, borderRadius: 4 }}>
                     <Typography variant="h5" sx={{ mb: 2 }}>My Address</Typography>
                     <Typography variant="body1">{user.address}</Typography>
                </Card>
             )}

          </Grid>
        </Grid>
      </Container>
    </div>
  );
}