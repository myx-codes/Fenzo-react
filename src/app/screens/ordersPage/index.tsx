import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useHistory } from "react-router-dom";

import OrderService from "../../services/OrderService";
import { Order } from "../../../lib/types/order";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";

const orderService = new OrderService();

const ORDER_STATUSES = ["ALL", "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

function getOrderStatus(order: Order): string {
  return String(order.status || order.orderStatus || "PENDING").toUpperCase();
}

function getOrderTotal(order: Order): number {
  return Number(order.total ?? order.orderTotal ?? 0);
}

export function OrdersPage() {
  const history = useHistory();
  const { authUser, t } = useGlobals();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    orderService
      .getMyOrders({ page: 1, limit: 50 })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authUser === null) {
      history.replace("/login");
      return;
    }
    fetchOrders();
  }, [authUser, history]);

  const visibleOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    if (statusFilter === "ALL") return sorted;
    return sorted.filter((order) => getOrderStatus(order) === statusFilter);
  }, [orders, statusFilter]);

  const handleCancelOrder = (orderId: string) => {
    const id = String(orderId);
    setCancellingOrderId(id);
    orderService
      .updateOrder(id, "CANCELLED")
      .then(fetchOrders)
      .catch(() => {})
      .finally(() => setCancellingOrderId(null));
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "45vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "#2a5298" }} />
      </Box>
    );
  }

  return (
    <div className="orders-page">
      <Container maxWidth="lg">
        <Box className="orders-header" sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography className="orders-title">{t("myOrdersTitle")}</Typography>
            <Typography className="orders-subtitle">{t("myOrdersSubtitle")}</Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>{t("status")}</InputLabel>
            <Select
              label={t("status")}
              value={statusFilter}
              onChange={(e) => setStatusFilter(String(e.target.value))}
            >
              {ORDER_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status === "ALL" ? t("orders") : status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {visibleOrders.length === 0 ? (
          <Paper elevation={0} className="order-card" sx={{ textAlign: "center" }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: "#9aa7b8", mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>{t("noOrdersYet")}</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {t("noOrdersForFilter")}
            </Typography>
            <Button variant="contained" onClick={() => history.push("/products/ALL")}>
              {t("startShopping")}
            </Button>
          </Paper>
        ) : (
          visibleOrders.map((order) => {
            const status = getOrderStatus(order);
            const canCancel = ["PENDING", "PAID", "PROCESSING"].includes(status);
            const total = getOrderTotal(order);

            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id-box">
                    <div className="order-id">{t("order")} #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Chip label={status} className={`status-badge status-${status}`} />
                </div>

                <div className="order-item-list">
                  {(order.orderItems || []).map((item) => (
                    <div key={`${order._id}-${item.productId}`} className="order-item-row">
                      <img
                        src={item.productImage ? `${serverApi}/${item.productImage}` : "/img/placeholder.jpg"}
                        alt={item.productName || "Product"}
                        className="order-item-img"
                      />
                      <div className="order-item-details">
                        <div className="order-item-name">{item.productName || `Product ${item.productId.slice(-5)}`}</div>
                        <div className="order-item-meta">{t("qty")}: {item.itemQuantity}</div>
                      </div>
                      <div className="order-item-price">${Number(item.itemPrice).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="total-price-box">
                    <span className="total-label">{t("total")}</span>
                    <span className="total-amount">${total.toFixed(2)}</span>
                  </div>

                  <div className="order-actions">
                    <Button
                      className="btn-order-outline"
                      startIcon={<LocalShippingIcon />}
                      onClick={() => history.push("/help")}
                    >
                      {t("support")}
                    </Button>
                    {canCancel && (
                      <Button
                        className="btn-order-filled"
                        startIcon={<ReceiptLongIcon />}
                        disabled={cancellingOrderId === order._id}
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        {cancellingOrderId === order._id ? t("cancelling") : t("cancel")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </Container>
    </div>
  );
}