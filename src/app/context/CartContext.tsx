import React, { createContext, useContext, ReactNode } from "react";
import useBasket from "../hooks/useBasket";
import { CartItem } from "../../lib/types/cart";

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const basket = useBasket();
  const value: CartContextValue = {
    cartItems: basket.cartItems,
    cartCount: basket.cartItems.length,
    onAdd: basket.onAdd,
    onRemove: basket.onRemove,
    onDelete: basket.onDelete,
    onDeleteAll: basket.onDeleteAll,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
