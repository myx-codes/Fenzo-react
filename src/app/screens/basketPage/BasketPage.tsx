import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { serverApi } from "../../../lib/config";

/**
 * Full-page cart view (e.g. when navigating to /basket).
 * Mini cart is the dropdown in the navbar.
 */
export function BasketPage() {
  const history = useHistory();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useCart();
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Cart {cartItems.length > 0 && `(${cartItems.length} items)`}
      </Typography>
      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Your cart is empty.
          </Typography>
          <Button variant="contained" onClick={() => history.push("/products/ALL")}>
            Continue shopping
          </Button>
        </Box>
      ) : (
        <>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {cartItems.map((item) => (
              <Box
                component="li"
                key={item._id}
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
                  alt={item.name}
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price} × {item.quantity}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Button size="small" onClick={() => onRemove(item)}>
                    −
                  </Button>
                  <Button size="small" onClick={() => onAdd(item)}>
                    +
                  </Button>
                  <Button size="small" color="error" onClick={() => onDelete(item)}>
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Total: ${total.toFixed(1)}</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" onClick={onDeleteAll}>
                Clear cart
              </Button>
              <Button variant="contained" onClick={() => history.push("/products/ALL")}>
                Continue shopping
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
