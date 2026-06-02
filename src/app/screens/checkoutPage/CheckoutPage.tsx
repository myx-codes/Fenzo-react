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
        .warning("Please sign up first.", "Register to purchase a product.")
        .then(() => history.push("/signup"));
    }
  }, [authUser, history]);

  const canGoNextFromDelivery = delivery.address.trim() !== "";

  const orderItems = useMemo(() => {
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

  const handleRemoveItem = (item: {
    productId: string;
    quantity: number;
    price: number;
    name?: string;
    image?: string;
  }) => {
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

  const handlePlaceOrder = () => {
    setError(null);
    setPlacing(true);

    const body: CreateOrderInput = {
      items: orderItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
      note:
        [delivery.address, delivery.city, delivery.zip, delivery.phone, delivery.note]
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
      <div className="checkout-page">
        <Container maxWidth="md">
          <Paper elevation={0} className="checkout-empty-card">
            <Typography className="checkout-empty-title">Your cart is empty.</Typography>
            <Typography className="checkout-empty-text">
              Add products to your cart before checkout.
            </Typography>
            <Button className="checkout-primary-btn" onClick={() => history.push("/products/ALL")}>
              Continue shopping
            </Button>
          </Paper>
        </Container>
      </div>
    );
  }

  if (authUser === null) {
    return (
      <Box className="checkout-loading">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg" className="checkout-container">
        <Button className="checkout-back-btn" startIcon={<ArrowBackIcon />} onClick={() => history.goBack()}>
          Back
        </Button>

        <Box className="checkout-header">
          <Typography className="checkout-kicker">Checkout Orders</Typography>
        </Box>

        <Stepper activeStep={activeStep} className="checkout-stepper">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={0} className="checkout-card">
          {activeStep === 0 && (
            <Box>
              <Typography className="checkout-section-title">
                <LocalMallIcon /> Review items
              </Typography>

              <Box component="ul" className="checkout-items-list">
                {orderItems.map((item) => (
                  <Box component="li" key={item.productId} className="checkout-item-row">
                    <img
                      src={item.image ? `${serverApi}/${item.image}` : "/img/placeholder.jpg"}
                      alt={item.name || "Item"}
                      onClick={() => history.push(`/products/detail/${item.productId}`)}
                      className="checkout-item-img"
                    />

                    <Box className="checkout-item-info">
                      <Typography className="checkout-item-name">
                        {item.name || `Product ${item.productId.slice(-6)}`}
                      </Typography>
                      <Typography className="checkout-item-meta">
                        ${item.price} × {item.quantity}
                      </Typography>
                    </Box>

                    <Typography className="checkout-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>

                    <IconButton
                      className="checkout-delete-btn"
                      size="small"
                      onClick={() => handleRemoveItem(item)}
                      aria-label="Remove"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Divider className="checkout-divider" />

              <Box className="checkout-subtotal-row">
                <Typography>Total:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography className="checkout-section-title">
                <LocalShippingIcon /> Delivery address
              </Typography>

              <Stack spacing={2} className="checkout-form">
                <TextField
                  fullWidth
                  label="Street address"
                  value={delivery.address}
                  onChange={(e) => setDelivery((d) => ({ ...d, address: e.target.value }))}
                  placeholder="123 Main St"
                  required
                />

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

          {activeStep === 2 && (
            <Box>
              <Typography className="checkout-section-title">
                <PaymentIcon /> Payment method
              </Typography>

              <FormControl component="fieldset" fullWidth className="checkout-payment-method">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as "delivery" | "card")}
                >
                  <FormControlLabel value="delivery" control={<Radio />} label="Pay on delivery (cash or card)" />
                  <FormControlLabel value="card" control={<Radio />} label="Pay by card (Visa, Mastercard, etc.)" />
                </RadioGroup>
              </FormControl>

              {paymentMethod === "card" && (
                <Paper variant="outlined" className="checkout-card-form">
                  <Box className="checkout-card-tags">
                    <Typography>Accepted cards</Typography>
                    <Box>
                      <span>Visa</span>
                      <span>MC</span>
                      <span>Amex</span>
                      <span>UnionPay</span>
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
                          <Box component="span" className="checkout-card-type">
                            {cardType === "visa"
                              ? "Visa"
                              : cardType === "mastercard"
                              ? "MC"
                              : cardType === "amex"
                              ? "Amex"
                              : "UnionPay"}
                          </Box>
                        ),
                      }}
                    />

                    <Box className="checkout-card-row">
                      <TextField
                        label="Expiry (MM/YY)"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        inputProps={{ maxLength: 5 }}
                      />

                      <TextField
                        label="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder={cardType === "amex" ? "4 digits" : "123"}
                        inputProps={{ maxLength: 4 }}
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
                </Paper>
              )}
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography className="checkout-section-title">
                <AssignmentIcon /> Order summary
              </Typography>

              <Box className="checkout-summary-list">
                {orderItems.map((item) => (
                  <Box key={item.productId} className="checkout-summary-row">
                    <Typography>{item.name || `Product ${item.productId.slice(-6)}`} × {item.quantity}</Typography>
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>

              <Divider className="checkout-divider" />

              <Box className="checkout-summary-row">
                <Typography>Delivery</Typography>
                <Typography>
                  {delivery.address || delivery.city
                    ? [delivery.address, delivery.city, delivery.zip].filter(Boolean).join(", ") || "—"
                    : "—"}
                </Typography>
              </Box>

              <Box className="checkout-summary-row">
                <Typography>Payment</Typography>
                <Typography>
                  {paymentMethod === "delivery"
                    ? "Pay on delivery"
                    : `Card (${cardType !== "unknown" ? cardType.charAt(0).toUpperCase() + cardType.slice(1) : "Card"} •••• ${
                        cardNumberRaw.slice(-4) || "----"
                      })`}
                </Typography>
              </Box>

              <Divider className="checkout-divider" />

              <Box className="checkout-total-row">
                <Typography>Total</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>

              {error && <Typography className="checkout-error">{error}</Typography>}
            </Box>
          )}

          <Box className="checkout-actions">
            <Button className="checkout-secondary-btn" disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>

            <Box className="checkout-spacer" />

            {activeStep === steps.length - 1 ? (
              <Button className="checkout-primary-btn" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? <CircularProgress size={22} /> : "Order"}
              </Button>
            ) : (
              <Button
                className="checkout-primary-btn"
                onClick={handleNext}
                disabled={(activeStep === 1 && !canGoNextFromDelivery) || (activeStep === 2 && !canGoNextFromPayment)}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default CheckoutPage;