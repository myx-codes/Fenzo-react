import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
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
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useGlobals } from "../../hooks/useGlobals";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { serverApi } from "../../../lib/config";
import UserService from "../../services/UserService";
import { UserUpdateInput } from "../../../lib/types/user";
import { Messages } from "../../../lib/config";

const userService = new UserService();

export function MyPage() {
  const history = useHistory();
  const location = useLocation();
  const { authUser, setAuthUser, logout } = useGlobals();
  const { wishlistItems, removeFromWishlist } = useWishlistContext();
  const { onAdd: addToCart } = useCart();

  const tabFromUrl = new URLSearchParams(location.search).get("tab");
  const [tabValue, setTabValue] = useState(tabFromUrl === "wishlist" ? "wishlist" : tabFromUrl === "info" ? "info" : tabFromUrl === "address" ? "address" : "orders");

  // Personal info form (synced from authUser)
  const [infoNick, setInfoNick] = useState("");
  const [infoPhone, setInfoPhone] = useState("");
  const [infoAddress, setInfoAddress] = useState("");
  const [infoDesc, setInfoDesc] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoError, setInfoError] = useState("");

  useEffect(() => {
    if (tabFromUrl === "wishlist") setTabValue("wishlist");
    else if (tabFromUrl === "info") setTabValue("info");
    else if (tabFromUrl === "address") setTabValue("address");
    else setTabValue("orders");
  }, [tabFromUrl]);

  useEffect(() => {
    if (authUser) {
      setInfoNick(authUser.userNick || "");
      setInfoPhone(authUser.userPhone || "");
      setInfoAddress(authUser.userAddress || "");
      setInfoDesc(authUser.userDesc || "");
    }
  }, [authUser]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authUser === null) {
      history.replace("/login");
    }
  }, [authUser, history]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const handleSaveInfo = async () => {
    if (!authUser) return;
    setInfoError("");
    if (!infoNick.trim() || !infoPhone.trim()) {
      setInfoError(Messages.errorValidation);
      return;
    }
    setInfoSaving(true);
    try {
      const input: UserUpdateInput = {
        userNick: infoNick.trim(),
        userPhone: infoPhone.trim(),
        userAddress: infoAddress.trim() || undefined,
        userDesc: infoDesc.trim() || undefined,
      };
      const updated = await userService.updateMember(authUser._id, input);
      setAuthUser({ ...authUser, ...updated });
    } catch (err: any) {
      setInfoError(err?.response?.data?.message || Messages.error1);
    } finally {
      setInfoSaving(false);
    }
  };

  if (authUser === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const user = authUser;
  const avatarSrc = user.userImage ? `${serverApi}/${user.userImage}` : undefined;
  const displayName = user.userNick || "User";

  return (
    <div className="my-page">
      <Container>
        <Stack className="my-page-title">
          <Typography variant="h2">My Account</Typography>
        </Stack>

        <Grid container spacing={4}>
          {/* --- LEFT SIDEBAR --- */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Card className="user-sidebar-card">
              <Box className="user-avatar-box">
                <Avatar src={avatarSrc} alt={displayName} sx={{ width: 100, height: 100, fontSize: 40 }}>
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" className="user-name">{displayName}</Typography>
                <Typography variant="body2" className="user-email">{user.userPhone}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box className="user-menu">
                <Tabs
                  orientation="vertical"
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
                  TabIndicatorProps={{ style: { display: "none" } }}
                >
                  <Tab label="My Orders" value="orders" icon={<LocalMallIcon />} iconPosition="start" className={tabValue === "orders" ? "active-tab" : ""} />
                  <Tab label="Wishlist" value="wishlist" icon={<FavoriteIcon />} iconPosition="start" className={tabValue === "wishlist" ? "active-tab" : ""} />
                  <Tab label="Personal Info" value="info" icon={<PersonIcon />} iconPosition="start" className={tabValue === "info" ? "active-tab" : ""} />
                  <Tab label="Address" value="address" icon={<LocationOnIcon />} iconPosition="start" className={tabValue === "address" ? "active-tab" : ""} />
                </Tabs>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ p: 2 }}>
                <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                  Log Out
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* --- RIGHT CONTENT --- */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            {/* 1. ORDERS TAB — real data: empty state until orders API exists */}
            {tabValue === "orders" && (
              <Stack spacing={3}>
                <Typography variant="h4" sx={{ mb: 1 }}>Order History</Typography>
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <LocalMallIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>No orders yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>When you place orders, they will appear here.</Typography>
                  <Button variant="contained" onClick={() => history.push("/products/ALL")}>Browse products</Button>
                </Card>
              </Stack>
            )}

            {/* 2. WISHLIST TAB — real wishlist from context */}
            {tabValue === "wishlist" && (
              <Stack spacing={3}>
                <Typography variant="h4" sx={{ mb: 1 }}>My Wishlist</Typography>
                {wishlistItems.length === 0 ? (
                  <Card sx={{ p: 4, textAlign: "center" }}>
                    <FavoriteIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>Your wishlist is empty</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Save items you like by clicking the heart on product pages.</Typography>
                    <Button variant="contained" onClick={() => history.push("/products/ALL")}>Discover products</Button>
                  </Card>
                ) : (
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 2 }}>
                    {wishlistItems.map((item) => (
                      <Card key={item._id} sx={{ overflow: "hidden" }}>
                        <Box sx={{ position: "relative" }}>
                          <img
                            src={item.image ? `${serverApi}/${item.image}` : "/img/placeholder.jpg"}
                            alt={item.name}
                            style={{ width: "100%", height: 200, objectFit: "cover" }}
                          />
                          <IconButton
                            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255,255,255,0.9)" }}
                            onClick={() => removeFromWishlist(item._id)}
                            aria-label="Remove from wishlist"
                          >
                            <DeleteOutlineIcon color="error" />
                          </IconButton>
                        </Box>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} noWrap title={item.name}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.collection}</Typography>
                          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>${item.price.toLocaleString()}</Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<ShoppingCartIcon />}
                            sx={{ mt: 2 }}
                            onClick={() => {
                              addToCart({
                                _id: item._id,
                                name: item.name,
                                price: item.price,
                                quantity: 1,
                                image: item.image,
                                collection: item.collection,
                              });
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                )}
              </Stack>
            )}

            {/* 3. PERSONAL INFO TAB — real data + save to API */}
            {tabValue === "info" && (
              <Card sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Personal Information</Typography>
                <Typography paragraph color="text.secondary">Edit your nickname, phone and description. Changes are saved to your account.</Typography>
                <Stack spacing={2} sx={{ maxWidth: 400 }}>
                  <TextField fullWidth label="Username / Nickname" value={infoNick} onChange={(e) => setInfoNick(e.target.value)} required />
                  <TextField fullWidth label="Phone" value={infoPhone} onChange={(e) => setInfoPhone(e.target.value)} required placeholder="e.g. +998901234567" />
                  <TextField fullWidth label="Short bio (optional)" value={infoDesc} onChange={(e) => setInfoDesc(e.target.value)} multiline rows={2} />
                  <TextField fullWidth label="Address (optional)" value={infoAddress} onChange={(e) => setInfoAddress(e.target.value)} placeholder="City, street, etc." />
                  {infoError && <Typography color="error">{infoError}</Typography>}
                  <Button variant="contained" onClick={handleSaveInfo} disabled={infoSaving}>
                    {infoSaving ? "Saving…" : "Save changes"}
                  </Button>
                </Stack>
              </Card>
            )}

            {/* 4. ADDRESS TAB — real data from authUser */}
            {tabValue === "address" && (
              <Card sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>My Address</Typography>
                {user.userAddress ? (
                  <Typography variant="body1">{user.userAddress}</Typography>
                ) : (
                  <>
                    <Typography color="text.secondary" paragraph>No address set.</Typography>
                    <Typography variant="body2" color="text.secondary">You can add or update your address in the Personal Info tab.</Typography>
                  </>
                )}
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
