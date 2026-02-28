import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useCart } from "../../context/CartContext";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { serverApi } from "../../../lib/config";
import { sweetAlert } from "../../../lib/sweetalert";
import { CartItem } from "../../../lib/types/cart";
import { CreateOrderInput, BuyNowItem } from "../../../lib/types/order";

const steps = ["Cart", "Delivery", "Payment", "Confirm"];
const orderService = new OrderService();

type CardType = "visa" | "mastercard" | "amex" | "unionpay" | "unknown";

function getCardType(num: string): CardType {
  const n = num.replace(/\D/g, "").slice(0, 4);
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2(22[1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720)/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^62|^88/.test(n)) return "unionpay";
  return "unknown";
}

function formatCardNumber(value: string): string {
  const v = value.replace(/\D/g, "").slice(0, 16);
  return v.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const v = value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 2) return `${v.slice(0, 2)}/${v.slice(2)}`;
  return v;
}

function CheckoutPage() {
  const history = useHistory();
  const location = useLocation<{ buyNow?: BuyNowItem }>();
  const { cartItems, onDelete, onDeleteAll } = useCart();
  const { authUser } = useGlobals();

  const buyNow = location.state?.buyNow;

  const [activeStep, setActiveStep] = useState(0);
  const [delivery, setDelivery] = useState({
    address: "",
    city: "",
    zip: "",
    phone: "",
    note: "",
  });
  const [buyNowRemoved, setBuyNowRemoved] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"delivery" | "card">("delivery");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardType = getCardType(cardNumber);
  const cardNumberRaw = cardNumber.replace(/\D/g, "");
  const cardValid =
    cardNumberRaw.length >= 16 &&
    cardExpiry.replace(/\D/g, "").length === 4 &&
    cardCvv.replace(/\D/g, "").length >= 3 &&
    cardName.trim().length >= 2;
  const canGoNextFromPayment =
    paymentMethod === "delivery" || (paymentMethod === "card" && cardValid);

  useEffect(() => {
    if (authUser) {
      setDelivery((d) => ({
        ...d,
        address: d.address || authUser.userAddress || "",
        phone: d.phone || authUser.userPhone || "",
      }));
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser === null) {
      sweetAlert
        .warning("Please sign up first.”", "Register to purchase a product.")
        .then(() => history.push("/signup"));
    }
  }, [authUser, history]);

  const canGoNextFromDelivery = delivery.address.trim() !== "";
  // Hozircha city va zip ishlatilmaydi: delivery.city.trim() !== "" && delivery.zip.trim() !== ""

  const orderItems: { productId: string; quantity: number; price: number; name?: string; image?: string }[] = useMemo(() => {
    if (buyNow && !buyNowRemoved) {
      return [
        {
          productId: buyNow.productId,
          quantity: buyNow.quantity,
          price: buyNow.price,
          name: buyNow.name,
          image: buyNow.image,
        },
      ];
    }
    if (buyNow && buyNowRemoved) return [];
    return cartItems.map((i: CartItem) => ({
      productId: i._id,
      quantity: i.quantity,
      price: i.price,
      name: i.name,
      image: i.image,
    }));
  }, [buyNow, buyNowRemoved, cartItems]);

  const handleRemoveItem = (item: { productId: string; quantity: number; price: number; name?: string; image?: string }) => {
    if (buyNow) {
      setBuyNowRemoved(true);
      return;
    }
    const cartItem = cartItems.find((c) => c._id === item.productId);
    if (cartItem) onDelete(cartItem);
  };

  const subtotal = useMemo(
    () => orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [orderItems]
  );
  const isEmpty = orderItems.length === 0;

  const handleNext = () => {
    if (activeStep === steps.length - 1) return;
    if (activeStep === 1 && !canGoNextFromDelivery) return;
    if (activeStep === 2 && !canGoNextFromPayment) return;
    setActiveStep((s) => s + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((s) => s - 1);
    setError(null);
  };

  /** Last step: create order via createOrder API (POST order/create). */
  const handlePlaceOrder = () => {
    setError(null);
    setPlacing(true);

    const body: CreateOrderInput = {
      items: orderItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
      note: [delivery.address, delivery.city, delivery.zip, delivery.phone, delivery.note]
        .filter(Boolean)
        .join(" | ") || undefined,
    };

    orderService
      .createOrder(body)
      .then(() => {
        if (!buyNow) onDeleteAll();
        history.replace("/profile?tab=orders");
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || err?.message || "Failed to place order.");
      })
      .finally(() => setPlacing(false));
  };

  if (isEmpty) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your cart is empty.
        </Typography>
        <Button variant="contained" onClick={() => history.push("/products/ALL")} sx={{ mt: 2 }}>
          Continue shopping
        </Button>
      </Container>
    );
  }

  if (authUser === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress sx={{ color: "#1e3c72" }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mb: 2, textTransform: "none" }}>
        Back
      </Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        {/* Step 0: Cart */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <LocalMallIcon /> Review items
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {orderItems.map((item) => (
                <Box
                  component="li"
                  key={item.productId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <img
                    src={item.image ? `${serverApi}/${item.image}` : "/img/placeholder.jpg"}
                    alt={item.name || "Item"}
                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">{item.name || `Product ${item.productId.slice(-6)}`}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price} × {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem(item)}
                    aria-label="Remove"
                    sx={{ flexShrink: 0 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="h6">Subtotal: ${subtotal.toFixed(2)}</Typography>
            </Box>
          </Box>
        )}

        {/* Step 1: Delivery */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <LocalShippingIcon /> Delivery address
            </Typography>
            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <TextField
                fullWidth
                label="Street address"
                value={delivery.address}
                onChange={(e) => setDelivery((d) => ({ ...d, address: e.target.value }))}
                placeholder="123 Main St"
                required
              />
              {/* Hozircha City va Zip code ishlatilmaydi
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="City"
                  value={delivery.city}
                  onChange={(e) => setDelivery((d) => ({ ...d, city: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="ZIP / Postal code"
                  value={delivery.zip}
                  onChange={(e) => setDelivery((d) => ({ ...d, zip: e.target.value }))}
                  required
                />
              </Box>
              */}
              <TextField
                fullWidth
                label="Phone"
                value={delivery.phone}
                onChange={(e) => setDelivery((d) => ({ ...d, phone: e.target.value }))}
                placeholder="+1 234 567 8900"
              />
              <TextField
                fullWidth
                label="Delivery note (optional)"
                value={delivery.note}
                onChange={(e) => setDelivery((d) => ({ ...d, note: e.target.value }))}
                placeholder="Gate code, leave at door, etc."
                multiline
                rows={2}
              />
            </Stack>
          </Box>
        )}

        {/* Step 2: Payment */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <PaymentIcon /> Payment method
            </Typography>
            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as "delivery" | "card")}
              >
                <FormControlLabel value="delivery" control={<Radio />} label="Pay on delivery (cash or card)" />
                <FormControlLabel value="card" control={<Radio />} label="Pay by card (Visa, Mastercard, etc.)" />
              </RadioGroup>
            </FormControl>

            {paymentMethod === "card" && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", maxWidth: 420 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Accepted cards</Typography>
                  <Box sx={{ display: "flex", gap: 0.5, "& img": { height: 24 } }}>
                    <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: "white", border: "1px solid", borderColor: "divider", fontSize: 11, fontWeight: 700, color: "#1a1f71" }}>Visa</Box>
                    <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: "white", border: "1px solid", borderColor: "divider", fontSize: 11, fontWeight: 700, color: "#eb001b" }}>MC</Box>
                    <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: "white", border: "1px solid", borderColor: "divider", fontSize: 11, fontWeight: 700, color: "#006fcf" }}>Amex</Box>
                    <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: "white", border: "1px solid", borderColor: "divider", fontSize: 11, fontWeight: 700, color: "#006fcf" }}>UnionPay</Box>
                  </Box>
                </Box>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    inputProps={{ maxLength: 19 }}
                    InputProps={{
                      startAdornment: cardType !== "unknown" && (
                        <Box component="span" sx={{ mr: 1, fontSize: 20, fontWeight: 700, color: cardType === "visa" ? "#1a1f71" : cardType === "mastercard" ? "#eb001b" : "#006fcf" }}>
                          {cardType === "visa" ? "Visa" : cardType === "mastercard" ? "MC" : cardType === "amex" ? "Amex" : "UnionPay"}
                        </Box>
                      ),
                    }}
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="Expiry (MM/YY)"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      inputProps={{ maxLength: 5 }}
                      sx={{ width: 140 }}
                    />
                    <TextField
                      label="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder={cardType === "amex" ? "4 digits" : "123"}
                      inputProps={{ maxLength: 4 }}
                      sx={{ width: 120 }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.slice(0, 40))}
                    placeholder="John Doe"
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Step 3: Confirm */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <AssignmentIcon /> Order summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              {orderItems.map((item) => (
                <Box key={item.productId} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography variant="body2">
                    {item.name || `Product ${item.productId.slice(-6)}`} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Delivery</Typography>
              <Typography variant="body2">
                {delivery.address || delivery.city ? [delivery.address, delivery.city, delivery.zip].filter(Boolean).join(", ") || "—" : "—"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Payment</Typography>
              <Typography variant="body2">
                {paymentMethod === "delivery"
                  ? "Pay on delivery"
                  : `Card (${cardType !== "unknown" ? cardType.charAt(0).toUpperCase() + cardType.slice(1) : "Card"} •••• ${cardNumberRaw.slice(-4) || "----"})`}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" sx={{ color: "primary.main" }}>${subtotal.toFixed(2)}</Typography>
            </Box>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button disabled={activeStep === 0} onClick={handleBack} sx={{ textTransform: "none" }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handlePlaceOrder}
              disabled={placing}
              sx={{ bgcolor: "#2a5298", color: "white",  textTransform: "none", fontWeight: 600 }}
            >
              {placing ? <CircularProgress size={24} /> : "Order"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={(activeStep === 1 && !canGoNextFromDelivery) || (activeStep === 2 && !canGoNextFromPayment)}
              sx={{ bgcolor: "#2a5298", color: "white",  textTransform: "none", fontWeight: 600 }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default CheckoutPage;
