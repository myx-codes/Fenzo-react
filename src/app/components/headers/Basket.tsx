import React from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartItem } from "src/lib/types/cart";
import { serverApi } from "src/lib/config";
import { useCart } from "../../context/CartContext";
import { useHistory } from "react-router-dom";
import "../../../css/basket.css";

export interface BasketProps {
  iconButtonClassName?: string;
}

export default function Basket({ iconButtonClassName }: BasketProps = {}) {
  const history = useHistory();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useCart();

  const itemsPrice = cartItems.reduce((a: number, c: CartItem) => a + c.quantity * c.price, 0);
  const shippingCost = itemsPrice > 0 && itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(2);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCheckout = () => {
    handleClose();
    history.push("/checkout");
  };

  return (
    <Box className="basket-root">
      <IconButton
        aria-label="cart"
        aria-controls={open ? "basket-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className={iconButtonClassName || "basket-trigger"}
      >
        <Badge badgeContent={cartItems.length} color="error" className="basket-badge">
          <ShoppingCartIcon className="basket-trigger-icon" sx={iconButtonClassName ? { color: "#fff" } : undefined} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="basket-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          className: "basket-menu-paper",
          sx: {
            width: 380,
            maxWidth: "calc(100vw - 24px)",
            borderRadius: 3,
            overflow: "hidden",
            mt: 1.5,
            border: "1px solid var(--basket-border)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              borderLeft: "1px solid var(--basket-border)",
              borderTop: "1px solid var(--basket-border)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="basket-menu-container">
          {/* Header */}
          <div className="basket-header">
            <Typography className="basket-title">Your cart</Typography>
            {cartItems.length > 0 && (
              <Button
                size="small"
                startIcon={<DeleteForeverIcon sx={{ fontSize: 18 }} />}
                onClick={onDeleteAll}
                className="basket-clear-btn"
                disableRipple
              >
                Clear all
              </Button>
            )}
          </div>
          <Divider className="basket-divider" />

          {/* Items list */}
          <div className="basket-items-list">
            {cartItems.length === 0 ? (
              <div className="basket-empty">
                <div className="basket-empty-icon-wrap">
                  <ShoppingCartOutlinedIcon className="basket-empty-icon" />
                </div>
                <Typography className="basket-empty-title">Your cart is empty</Typography>
                <Typography className="basket-empty-text">Add items from the store to get started.</Typography>
              </div>
            ) : (
              cartItems.map((item: CartItem) => {
                const imagePath = item.image ? `${serverApi}/${item.image}` : "";
                return (
                  <div key={item._id} className="basket-item">
                    <img src={imagePath} alt={item.name} className="basket-item-img" />
                    <div className="basket-item-details">
                      <Typography className="basket-item-name" title={item.name}>
                        {item.name}
                      </Typography>
                      <Typography className="basket-item-price">${item.price?.toFixed(2) ?? item.price}</Typography>
                      <div className="basket-qty-controls">
                        <IconButton size="small" onClick={() => onRemove(item)} className="basket-qty-btn" aria-label="Decrease">
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <span className="basket-qty-value">{item.quantity}</span>
                        <IconButton size="small" onClick={() => onAdd(item)} className="basket-qty-btn" aria-label="Increase">
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </div>
                    </div>
                    <IconButton size="small" onClick={() => onDelete(item)} className="basket-item-delete" aria-label="Remove">
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <>
              <Divider className="basket-divider" />
              <div className="basket-footer">
                <div className="basket-summary-row">
                  <span className="basket-summary-label">Subtotal</span>
                  <span className="basket-summary-value">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="basket-summary-row">
                  <span className="basket-summary-label">Shipping</span>
                  <span className="basket-summary-value">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="basket-summary-row basket-summary-total">
                  <span className="basket-summary-total-label">Total</span>
                  <span className="basket-summary-total-value">${totalPrice}</span>
                </div>
                <Button
                  fullWidth
                  variant="contained"
                  className="basket-checkout-btn"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleCheckout}
                >
                  Order
                </Button>
              </div>
            </>
          )}
        </div>
      </Menu>
    </Box>
  );
}
