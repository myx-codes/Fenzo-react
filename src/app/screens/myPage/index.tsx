import React, { useState } from "react";
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
  IconButton 
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite'; // TOLA YURAK
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

// 1. MOCK DATA (Buyurtmalar tarixi)
const orderHistory = [
  {
    id: "#ORD-7741",
    date: "12 Feb, 2024",
    total: "$250.00",
    status: "Delivered",
    items: [
        { name: "Wireless Headset Pro", img: "/img/nike-sneakers.avif", price: "$120", qty: 1 },
        { name: "Smart Watch S7", img: "/img/nike-sneakers.avif", price: "$130", qty: 1 },
    ]
  },
  {
    id: "#ORD-5523",
    date: "10 Jan, 2024",
    total: "$85.00",
    status: "Processing",
    items: [
        { name: "Men's Casual Jacket", img: "/img/nike-sneakers.avif", price: "$85", qty: 1 },
    ]
  },
];

// 2. MOCK DATA (Sevimlilar / Wishlist)
const wishlistItems = [
    { id: 1, name: "Wireless Headset Pro", price: "$120.00", img: "/img/nike-sneakers.avif" },
    { id: 2, name: "Men's Casual Jacket", price: "$85.00", img: "/img/nike-sneakers.avif" },
    { id: 3, name: "Running Sneakers", price: "$95.00", img: "/img/nike-sneakers.avif" },
    { id: 4, name: "Digital Camera 4K", price: "$650.00", img: "/img/nike-sneakers.avif" },
];

// Foydalanuvchi ma'lumoti
const user = {
    name: "Akmal Juraev",
    email: "akmal@example.com",
    phone: "+998 90 123 45 67",
    address: "Tashkent, Uzbekistan, Chilanzar 12",
    avatar: "/img/user-avatar.jpg" 
};

export function MyPage() {
  const [tabValue, setTabValue] = useState("orders");

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

  return (
    <div className="my-page">
      <Container>
        <Stack className="my-page-title">
            <Typography variant="h2">My Account</Typography>
        </Stack>

        <Grid container spacing={4}>
          
          {/* --- LEFT SIDEBAR (USER INFO) --- */}
          {/* Grid size={{...}} sintaksisi MUI v6 yoki Grid2 da ishlatiladi. v5 uchun Grid item xs={...} ishlatamiz */}
           <Grid size={{xs:12, md:4, lg:3 }}>
            <Card className="user-sidebar-card">
                <Box className="user-avatar-box">
                    <Avatar 
                        src={user.avatar} 
                        alt={user.name} 
                        sx={{ width: 100, height: 100, fontSize: 40 }}
                    >
                        {user.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h5" className="user-name">{user.name}</Typography>
                    <Typography variant="body2" className="user-email">{user.email}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <Box className="user-menu">
                    <Tabs
                        orientation="vertical"
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}
                        className="vertical-tabs"
                        TabIndicatorProps={{ style: { display: "none" } }}
                    >
                        <Tab 
                            label="My Orders" 
                            value="orders" 
                            icon={<LocalMallIcon />} 
                            iconPosition="start"
                            className={tabValue === 'orders' ? 'active-tab' : ''}
                        />
                        {/* --- YANGI QOSHILGAN TAB (WISHLIST) --- */}
                        <Tab 
                            label="Wishlist" 
                            value="wishlist" 
                            icon={<FavoriteIcon />} 
                            iconPosition="start"
                            className={tabValue === 'wishlist' ? 'active-tab' : ''}
                        />
                         <Tab 
                            label="Personal Info" 
                            value="info" 
                            icon={<PersonIcon />} 
                            iconPosition="start"
                            className={tabValue === 'info' ? 'active-tab' : ''}
                        />
                         <Tab 
                            label="Address" 
                            value="address" 
                            icon={<LocationOnIcon />} 
                            iconPosition="start"
                            className={tabValue === 'address' ? 'active-tab' : ''}
                        />
                    </Tabs>
                </Box>

                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ p: 2 }}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        color="error" 
                        startIcon={<LogoutIcon />}
                    >
                        Log Out
                    </Button>
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
                                    <Typography variant="h6" className="order-id">
                                        Order {order.id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Placed on {order.date}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={order.status} 
                                    color={getStatusColor(order.status) as any} 
                                    variant="outlined"
                                    size="small" 
                                />
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
                                <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                                    {order.total}
                                </Typography>
                            </Box>
                        </Card>
                    ))}
                </Stack>
             )}

             {/* 2. WISHLIST TAB (YANGI QOSHILDI) */}
             {tabValue === "wishlist" && (
                <Stack spacing={3}>
                    <Typography variant="h4" sx={{ mb: 1 }}>My Wishlist</Typography>
                    
                    <Grid container spacing={3}>
                        {wishlistItems.map((item) => (
                           <Grid size={{xs:12, md:6, lg:4}} key={item.id}>
                                <Card sx={{ 
                                    p: 2, 
                                    borderRadius: 3, 
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    position: 'relative'
                                }}>
                                    {/* Delete Button */}
                                    <IconButton 
                                        size="small" 
                                        sx={{ position: 'absolute', top: 10, right: 10, color: '#f44336', bgcolor: '#ffebee' }}
                                    >
                                        <DeleteOutlineIcon fontSize="small"/>
                                    </IconButton>

                                    {/* Image */}
                                    <Box sx={{ height: 180, display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <img 
                                            src={item.img} 
                                            alt={item.name} 
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                        />
                                    </Box>

                                    {/* Info */}
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, flexGrow: 1 }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                        {item.price}
                                    </Typography>

                                    {/* Add to Cart Button */}
                                    <div className="action-buttons">
                                      <Button variant="outlined" className="btn-cart">
                                        Add Cart
                                      </Button>
                                      <Button variant="contained" className="btn-buy">
                                        Buy Now
                                      </Button>
                                    </div>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
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