import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useCart } from "../../context/CartContext";
import OrderService from "../../services/OrderService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/cart";
import { CreateOrderInput, BuyNowItem } from "../../../lib/types/order";

const steps = ["Cart", "Delivery", "Payment", "Confirm"];
const orderService = new OrderService();

function CheckoutPage() {
  const history = useHistory();
  const location = useLocation<{ buyNow?: BuyNowItem }>();
  const { cartItems, onDeleteAll } = useCart();

  const buyNow = location.state?.buyNow;

  const [activeStep, setActiveStep] = useState(0);
  const [delivery, setDelivery] = useState({
    address: "",
    city: "",
    zip: "",
    phone: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"delivery" | "card">("delivery");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderItems: { productId: string; quantity: number; price: number; name?: string; image?: string }[] = useMemo(() => {
    if (buyNow) {
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
    return cartItems.map((i: CartItem) => ({
      productId: i._id,
      quantity: i.quantity,
      price: i.price,
      name: i.name,
      image: i.image,
    }));
  }, [buyNow, cartItems]);

  const subtotal = useMemo(
    () => orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [orderItems]
  );
  const isEmpty = orderItems.length === 0;

  const handleNext = () => {
    if (activeStep === steps.length - 1) return;
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

  if (isEmpty && !buyNow) {
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
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="City"
                  value={delivery.city}
                  onChange={(e) => setDelivery((d) => ({ ...d, city: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="ZIP / Postal code"
                  value={delivery.zip}
                  onChange={(e) => setDelivery((d) => ({ ...d, zip: e.target.value }))}
                />
              </Box>
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
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as "delivery" | "card")}
              >
                <FormControlLabel value="delivery" control={<Radio />} label="Pay on delivery (cash or card)" />
                <FormControlLabel value="card" control={<Radio />} label="Card online (coming soon)" disabled />
              </RadioGroup>
            </FormControl>
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
              <Typography variant="body2">{paymentMethod === "delivery" ? "Pay on delivery" : "Card"}</Typography>
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
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {placing ? <CircularProgress size={24} /> : "Place order"}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} sx={{ textTransform: "none", fontWeight: 600 }}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default CheckoutPage;
