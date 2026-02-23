import { useState, useCallback } from "react";
import { CartItem } from "../../lib/types/cart";

const CART_STORAGE_KEY = "cartData";

export default function useBasket() {
  const cartJson: string | null =
    typeof window !== "undefined" ? localStorage.getItem(CART_STORAGE_KEY) : null;
  const initialCart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const persist = useCallback((items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, []);

  const onAdd = useCallback(
    (input: CartItem) => {
      setCartItems((prev) => {
        const exist = prev.find((item) => item._id === input._id);
        let next: CartItem[];
        if (exist) {
          next = prev.map((item) =>
            item._id === input._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          next = [...prev, { ...input, quantity: input.quantity ?? 1 }];
        }
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const onRemove = useCallback(
    (input: CartItem) => {
      setCartItems((prev) => {
        const item = prev.find((i) => i._id === input._id);
        if (!item) return prev;
        if (item.quantity <= 1) {
          const next = prev.filter((i) => i._id !== input._id);
          persist(next);
          return next;
        }
        const next = prev.map((i) =>
          i._id === input._id ? { ...i, quantity: i.quantity - 1 } : i
        );
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const onDelete = useCallback(
    (input: CartItem) => {
      setCartItems((prev) => {
        const next = prev.filter((item) => item._id !== input._id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const onDeleteAll = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  return {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
  };
}
