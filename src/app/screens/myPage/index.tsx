import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Container,
  Box,
  Stack,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Card,
  Chip,
  Divider,
  TextField,
  CircularProgress,
  IconButton,
  Pagination,
  Grid,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";

import { useGlobals } from "../../hooks/useGlobals";
import { useWishlistContext } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { serverApi } from "../../../lib/config";
import UserService from "../../services/UserService";
import OrderService from "../../services/OrderService";
import { UserUpdateInput } from "../../../lib/types/user";
import { Order } from "../../../lib/types/order";
import { Messages } from "../../../lib/config";
import { sweetAlert } from "../../../lib/sweetalert";

const userService = new UserService();
const orderService = new OrderService();

export function MyPage() {
  const history = useHistory();
  const location = useLocation();
  const { authUser, setAuthUser, logout } = useGlobals();
  const { wishlistItems, removeFromWishlist } = useWishlistContext();
  const { onAdd: addToCart } = useCart();

  const tabFromUrl = new URLSearchParams(location.search).get("tab");
  const [tabValue, setTabValue] = useState(
    tabFromUrl === "wishlist" ? "wishlist" : 
    tabFromUrl === "info" ? "info" : 
    tabFromUrl === "address" ? "address" : "orders"
  );

  // --- Pagination States (Wishlist) ---
  const [wishlistPage, setWishlistPage] = useState(1);
  const wishlistItemsPerPage = 8; // Bitta sahifada 8 ta (2 qator, 4 ustun)
  
  const wishlistTotalPages = Math.ceil(wishlistItems.length / wishlistItemsPerPage);
  const currentWishlistItems = wishlistItems.slice(
    (wishlistPage - 1) * wishlistItemsPerPage,
    wishlistPage * wishlistItemsPerPage
  );

  useEffect(() => {
    if (wishlistPage > wishlistTotalPages && wishlistTotalPages > 0) {
      setWishlistPage(wishlistTotalPages);
    }
  }, [wishlistItems.length, wishlistTotalPages, wishlistPage]);

  // Edit Mode States
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Form states
  const [infoNick, setInfoNick] = useState("");
  const [infoPhone, setInfoPhone] = useState("");
  const [infoAddress, setInfoAddress] = useState("");
  const [infoDesc, setInfoDesc] = useState("");
  const [infoPassword, setInfoPassword] = useState("");
  const [infoPasswordConfirm, setInfoPasswordConfirm] = useState("");
  
  // Image Upload states
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [infoSaving, setInfoSaving] = useState(false);
  const [infoError, setInfoError] = useState("");

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (tabFromUrl === "wishlist") setTabValue("wishlist");
    else if (tabFromUrl === "info") setTabValue("info");
    else if (tabFromUrl === "address") setTabValue("address");
    else setTabValue("orders");
  }, [tabFromUrl]);

  const fetchMyOrders = () => {
    setOrdersLoading(true);
    orderService
      .getMyOrders({ page: 1, limit: 50 })
      .then(setMyOrders)
      .catch(() => setMyOrders([]))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    if (tabValue === "orders") fetchMyOrders();
  }, [tabValue]);

  const handleCancelOrder = (orderId: string) => {
    setCancellingOrderId(orderId);
    orderService
      .updateOrder(orderId, "CANCELLED")
      .then(() => fetchMyOrders())
      .catch(() => {})
      .finally(() => setCancellingOrderId(null));
  };

  const populateUserData = () => {
    if (authUser) {
      setInfoNick(authUser.userNick || "");
      setInfoPhone(authUser.userPhone || "");
      setInfoAddress(authUser.userAddress || "");
      setInfoDesc(authUser.userDesc || "");
      
      setInfoPassword("");
      setInfoPasswordConfirm("");
      setSelectedFile(null);

      if (authUser.userImage) {
        setPreviewImage(`${serverApi}/${authUser.userImage}`);
      } else {
        setPreviewImage("");
      }
    }
  };

  useEffect(() => {
    populateUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    if (authUser === null) {
      history.replace("/login");
    }
  }, [authUser, history]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    setIsEditingInfo(false);
    setIsEditingAddress(false);
    setInfoError("");
    populateUserData(); 
  };

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const cancelEdit = () => {
    setIsEditingInfo(false);
    setIsEditingAddress(false);
    setInfoError("");
    populateUserData(); 
  };

  const handleSaveInfo = async () => {
    if (!authUser) return;
    setInfoError("");
    
    if (!infoNick.trim() || !infoPhone.trim()) {
      setInfoError(Messages.errorValidation);
      return;
    }
    if (infoPassword.trim() && infoPassword !== infoPasswordConfirm) {
      setInfoError(Messages.errorPasswordMatch);
      return;
    }
    
    setInfoSaving(true);
    setInfoError("");
    
    try {
      let updatedUser;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("userNick", infoNick.trim());
        formData.append("userPhone", infoPhone.trim());
        formData.append("userAddress", infoAddress.trim());
        formData.append("userDesc", infoDesc.trim());
        if (infoPassword.trim()) formData.append("userPassword", infoPassword);
        formData.append("userImage", selectedFile);

        updatedUser = await userService.updateUserWithImage(authUser._id, formData);
      } else {
        const input: UserUpdateInput = {
          userNick: infoNick.trim(),
          userPhone: infoPhone.trim(),
          userAddress: infoAddress.trim(),
          userDesc: infoDesc.trim(),
        };
        if (infoPassword.trim()) input.userPassword = infoPassword;

        updatedUser = await userService.updateUser(authUser._id, input);
      }

      setAuthUser({ ...authUser, ...updatedUser });
      
      setInfoPassword("");
      setInfoPasswordConfirm("");
      setSelectedFile(null);
      setIsEditingInfo(false);
      setIsEditingAddress(false);
      
      await sweetAlert.success("Profile updated", "Your changes have been saved successfully.");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "";
      const isUsedNickPhone = err?.response?.status === 400 && (msg.toLowerCase().includes("nick") || msg.toLowerCase().includes("phone") || msg.toLowerCase().includes("used"));
      const errorMessage = isUsedNickPhone ? Messages.usedNickPhone : msg || Messages.error1;
      setInfoError(errorMessage);
      await sweetAlert.error("Update failed", errorMessage);
    } finally {
      setInfoSaving(false);
    }
  };

  if (authUser === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <CircularProgress sx={{ color: '#1e3c72' }} />
      </Box>
    );
  }

  const user = authUser;
  const avatarSrc = previewImage || (user.userImage ? `${serverApi}/${user.userImage}` : undefined);
  const displayName = user.userNick || "User";

  const fenzoCardStyle = {
    p: { xs: 3, md: 4 },
    borderRadius: 3,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.03)",
    border: "1px solid #eaeaea",
    bgcolor: "#ffffff"
  };

  return (
    <Box className="my-page" sx={{ bgcolor: "#f9fbfd", minHeight: "100vh", pt: 6, pb: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: "#2b2b2b" }}>
          My Account
        </Typography>

        <Grid container spacing={4}>
          {/* --- LEFT SIDEBAR --- */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Card sx={{ ...fenzoCardStyle, p: 0, overflow: "hidden" }}>
              <Box sx={{ p: 4, textAlign: "center", bgcolor: "#ffffff" }}>
                <Avatar 
                  src={avatarSrc} 
                  alt={displayName} 
                  sx={{ width: 110, height: 110, fontSize: 40, mx: "auto", mb: 2, border: "4px solid #f0f4f8", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>{displayName}</Typography>
                <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>{user.userPhone}</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ p: 2 }}>
                <Tabs
                  orientation="vertical"
                  value={tabValue}
                  onChange={handleTabChange}
                  TabIndicatorProps={{ style: { display: "none" } }}
                  sx={{
                    "& .MuiTab-root": {
                      justifyContent: "flex-start",
                      minHeight: 48,
                      borderRadius: 2,
                      mb: 0.5,
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#555",
                      fontSize: "0.95rem",
                      "&:hover": { bgcolor: "#f4f7fb", color: "#0d6efd" }
                    },
                    "& .Mui-selected": {
                      color: "#0d6efd !important",
                      bgcolor: "#ebf3ff",
                    }
                  }}
                >
                  <Tab label="My Orders" value="orders" icon={<LocalMallIcon />} iconPosition="start" />
                  <Tab label="Wishlist" value="wishlist" icon={<FavoriteIcon />} iconPosition="start" />
                  <Tab label="Personal Info" value="info" icon={<PersonIcon />} iconPosition="start" />
                  <Tab label="Address" value="address" icon={<LocationOnIcon />} iconPosition="start" />
                </Tabs>
              </Box>

              <Divider />
              
              <Box sx={{ p: 3 }}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="error" 
                  startIcon={<LogoutIcon />} 
                  onClick={handleLogout}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, py: 1 }}
                >
                  Log Out
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* --- RIGHT CONTENT --- */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            
            {/* 1. ORDERS TAB */}
            {tabValue === "orders" && (
              <Stack spacing={3}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>My Orders</Typography>
                {ordersLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress sx={{ color: "#0d6efd" }} />
                  </Box>
                ) : myOrders.length === 0 ? (
                  <Card sx={{ ...fenzoCardStyle, textAlign: "center", py: 8 }}>
                    <Box sx={{ width: 80, height: 80, bgcolor: "#f4f7fb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                      <LocalMallIcon sx={{ fontSize: 40, color: "#a0b2c6" }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>No orders yet</Typography>
                    <Typography variant="body2" sx={{ color: "#777", mb: 4, maxWidth: 300, mx: "auto" }}>
                      When you click Buy Now on a product, your orders will appear here.
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => history.push("/products/ALL")}
                      sx={{ bgcolor: "#0d6efd", borderRadius: 2, textTransform: "none", fontWeight: 600, px: 4, py: 1.2, boxShadow: "none" }}
                    >
                      Start Shopping
                    </Button>
                  </Card>
                ) : (
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, flexWrap: "wrap", px: 1.5, pb: 0.5, borderBottom: "2px solid", borderColor: "divider" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.5, minWidth: 90 }}>Product</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.5, minWidth: 90 }}>Order #</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.5, minWidth: 100 }}>Date</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Status</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Total</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.5, minWidth: 80, ml: "auto" }}>Action</Typography>
                    </Box>
                    {myOrders.map((order) => {
                      const orderDate = typeof order.createdAt === "string" ? new Date(order.createdAt) : (order.createdAt as Date);
                      const orderIdShort = order._id.slice(-8).toUpperCase();
                      const items = order.orderItems ?? [];
                      return (
                        <Card key={order._id} sx={{ ...fenzoCardStyle, p: 1.5 }}>
                          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 90 }}>
                              {items.length > 0 ? (
                                items.map((item) => (
                                  <img
                                    key={item.productId}
                                    src={item.productImage ? `${serverApi}/${item.productImage}` : "/img/placeholder.jpg"}
                                    alt={item.productName || ""}
                                    style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10 }}
                                    onError={(e) => { (e.target as HTMLImageElement).src = "/img/placeholder.jpg"; }}
                                  />
                                ))
                              ) : (
                                <Box sx={{ width: 64, height: 64, bgcolor: "#f0f0f0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <LocalMallIcon sx={{ fontSize: 28, color: "#999" }} />
                                </Box>
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#333", minWidth: 90 }}>
                              #{orderIdShort}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#777", minWidth: 100 }}>
                              {orderDate.toLocaleDateString(undefined, { dateStyle: "medium" })}
                            </Typography>
                            <Chip label={order.status || "Pending"} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600, height: 24 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0d6efd" }}>
                              ${Number(order.total).toLocaleString()}
                            </Typography>
                            <Box sx={{ minWidth: 80, ml: "auto" }}>
                              {(order.status || order.orderStatus || "").toUpperCase() === "PENDING" && (
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  disabled={cancellingOrderId === order._id}
                                  onClick={() => handleCancelOrder(order._id)}
                                  sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.75rem" }}
                                >
                                  {cancellingOrderId === order._id ? "..." : "Cancel"}
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            )}

            {/* 2. WISHLIST TAB */}
            {tabValue === "wishlist" && (
              <Stack spacing={3}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>My Wishlist</Typography>
                {wishlistItems.length === 0 ? (
                  <Card sx={{ ...fenzoCardStyle, textAlign: "center", py: 8 }}>
                    <Box sx={{ width: 80, height: 80, bgcolor: "#fdf0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                      <FavoriteIcon sx={{ fontSize: 40, color: "#f28b82" }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>Your wishlist is empty</Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => history.push("/products/ALL")}
                      sx={{ bgcolor: "#0d6efd", borderRadius: 2, mt: 2, textTransform: "none", fontWeight: 600 }}
                    >
                      Discover Products
                    </Button>
                  </Card>
                ) : (
                  <Box>
                    {/* Grid qismi: To'liq Grid2 size usuliga o'tkazildi (12 / 4 = 3) */}
                    <Grid container spacing={3}>
                      {currentWishlistItems.map((item) => (
                        <Grid key={item._id} size={{ xs: 12, sm: 6, md: 3 }}>
                          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,0.04)", border: "1px solid #eaeaea", position: "relative", height: "100%" }}>
                            <Box sx={{ position: "relative", overflow: "hidden", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                              <img src={item.image ? `${serverApi}/${item.image}` : "/img/placeholder.jpg"} alt={item.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                              <IconButton sx={{ position: "absolute", top: 10, right: 10, bgcolor: "rgba(255,255,255,0.9)" }} onClick={() => removeFromWishlist(item._id)} size="small">
                                <DeleteOutlineIcon color="error" fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box sx={{ p: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }} noWrap>{item.name}</Typography>
                              <Typography variant="body1" sx={{ color: "#0d6efd", fontWeight: 700, mt: 0.5 }}>${item.price.toLocaleString()}</Typography>
                              <Button fullWidth variant="outlined" startIcon={<ShoppingCartIcon />} size="small" sx={{ mt: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }} onClick={() => addToCart({...item, quantity: 1})}>
                                Add
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {wishlistTotalPages > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination 
                          count={wishlistTotalPages} 
                          page={wishlistPage} 
                          onChange={(_, page) => setWishlistPage(page)} 
                          color="primary" 
                          shape="rounded"
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Stack>
            )}

            {/* 3. PERSONAL INFO TAB */}
            {tabValue === "info" && (
              <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>Personal Information</Typography>
                  {!isEditingInfo && (
                    <Button 
                      variant="contained" 
                      startIcon={<EditIcon />} 
                      onClick={() => setIsEditingInfo(true)}
                      sx={{ bgcolor: "#0d6efd", borderRadius: 2, textTransform: "none", boxShadow: "none" }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>

                <Card sx={fenzoCardStyle}>
                  {/* --- VIEW MODE --- */}
                  {!isEditingInfo ? (
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                        <Avatar src={avatarSrc} sx={{ width: 80, height: 80, fontSize: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                          {displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>{user.userNick}</Typography>
                          <Typography variant="body1" sx={{ color: "#666", mt: 0.5 }}>{user.userPhone}</Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ mb: 3 }} />
                      
                      <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" sx={{ color: "#888", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1, mb: 1 }}>
                            Short Biography
                          </Typography>
                          <Typography variant="body1" sx={{ color: "#333" }}>
                            {user.userDesc || "No biography provided yet."}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" sx={{ color: "#888", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1, mb: 1 }}>
                            Password
                          </Typography>
                          <Typography variant="body1" sx={{ color: "#333" }}>
                            ••••••••••
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    /* --- EDIT MODE --- */
                    <Stack spacing={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3, p: 2, bgcolor: "#f9fbfd", borderRadius: 2, border: "1px solid #f0f0f0" }}>
                        <Avatar src={avatarSrc} sx={{ width: 70, height: 70, fontSize: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                          {displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Profile Photo</Typography>
                          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                          <Button variant="outlined" size="small" startIcon={<CloudUploadIcon />} onClick={() => fileInputRef.current?.click()} sx={{ borderRadius: 2, textTransform: "none" }}>
                            Upload new image
                          </Button>
                          {selectedFile && <Typography variant="caption" display="block" sx={{ mt: 1, color: "green" }}>Selected: {selectedFile.name}</Typography>}
                        </Box>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Username / Nickname" value={infoNick} onChange={(e) => setInfoNick(e.target.value)} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Phone Number" value={infoPhone} onChange={(e) => setInfoPhone(e.target.value)} required placeholder="+998901234567" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField fullWidth label="Short Bio (Optional)" value={infoDesc} onChange={(e) => setInfoDesc(e.target.value)} multiline rows={2} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Grid>
                      </Grid>

                      <Divider />
                      
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>Change Password</Typography>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth type="password" label="New Password" autoComplete="new-password" value={infoPassword} onChange={(e) => setInfoPassword(e.target.value)} placeholder="Leave blank to keep current" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth type="password" label="Confirm New Password" autoComplete="new-password" value={infoPasswordConfirm} onChange={(e) => setInfoPasswordConfirm(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                          </Grid>
                        </Grid>
                      </Box>

                      {infoError && <Typography color="error" sx={{ fontWeight: 500, fontSize: "0.9rem" }}>{infoError}</Typography>}
                      
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={cancelEdit} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}>
                          Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSaveInfo} disabled={infoSaving} sx={{ bgcolor: "#0d6efd", borderRadius: 2, textTransform: "none", fontWeight: 600, px: 4, boxShadow: "none" }}>
                          {infoSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </Box>
                    </Stack>
                  )}
                </Card>
              </Stack>
            )}

            {/* 4. ADDRESS TAB */}
            {tabValue === "address" && (
              <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>My Address</Typography>
                  {!isEditingAddress && (
                    <Button 
                      variant="contained" 
                      startIcon={<EditIcon />} 
                      onClick={() => setIsEditingAddress(true)}
                      sx={{ bgcolor: "#0d6efd", borderRadius: 2, textTransform: "none", boxShadow: "none" }}
                    >
                      {user.userAddress ? "Edit Address" : "Add Address"}
                    </Button>
                  )}
                </Box>
                
                <Card sx={fenzoCardStyle}>
                  {/* --- VIEW MODE --- */}
                  {!isEditingAddress ? (
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box sx={{ mt: 0.5, p: 1.5, bgcolor: "#e7f0ff", borderRadius: 2 }}>
                        <LocationOnIcon sx={{ color: "#0d6efd" }} />
                      </Box>
                      <Box sx={{ flex: 1, pt: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
                          Default Delivery Address
                        </Typography>
                        {user.userAddress ? (
                          <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.6 }}>
                            {user.userAddress}
                          </Typography>
                        ) : (
                          <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                            You haven't set up a delivery address yet. Click the button above to add one.
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    /* --- EDIT MODE --- */
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
                        Update Delivery Address
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter your full address (e.g. Tashkent city, Yunusabad district, street...)"
                        value={infoAddress}
                        onChange={(e) => setInfoAddress(e.target.value)}
                        multiline
                        rows={3}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                      
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                        <Button variant="outlined" color="inherit" onClick={cancelEdit} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}>
                          Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSaveInfo} disabled={infoSaving} sx={{ bgcolor: "#0d6efd", borderRadius: 2, textTransform: "none", fontWeight: 600, px: 4, boxShadow: "none" }}>
                          {infoSaving ? "Saving..." : "Save Address"}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Card>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}