import { useState, useCallback, useEffect } from "react";
import { WishlistItem } from "../../lib/types/wishlist";
import ProductService from "../services/ProductService";

const productService = new ProductService();

const WISHLIST_STORAGE_PREFIX = "wishlistData_";

function getStorageKey(userId: string | null): string {
  return userId ? `${WISHLIST_STORAGE_PREFIX}${userId}` : "";
}

function readWishlistFromStorage(userId: string | null): WishlistItem[] {
  if (typeof window === "undefined" || !userId) return [];
  const key = getStorageKey(userId);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export default function useWishlist(userId: string | null) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() =>
    readWishlistFromStorage(userId)
  );

  // When user signs in/out, load that user's wishlist (or empty for no user)
  useEffect(() => {
    setWishlistItems(readWishlistFromStorage(userId));
  }, [userId]);

  const persist = useCallback(
    (items: WishlistItem[]) => {
      if (!userId || typeof window === "undefined") return;
      localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
    },
    [userId]
  );

  const addToWishlist = useCallback(
    (item: WishlistItem) => {
      if (!userId) return;
      setWishlistItems((prev) => {
        if (prev.some((i) => i._id === item._id)) return prev;
        const next = [...prev, item];
        persist(next);
        return next;
      });
    },
    [userId, persist]
  );

  const removeFromWishlist = useCallback(
    (id: string) => {
      if (!userId) return;
      setWishlistItems((prev) => {
        const next = prev.filter((i) => i._id !== id);
        persist(next);
        return next;
      });
    },
    [userId, persist]
  );

  const toggleWishlist = useCallback(
    (item: WishlistItem) => {
      if (!userId) return;
      setWishlistItems((prev) => {
        const exists = prev.some((i) => i._id === item._id);
        const next = exists ? prev.filter((i) => i._id !== item._id) : [...prev, item];
        persist(next);
        return next;
      });
    },
    [userId, persist]
  );

  const isInWishlist = useCallback(
    (id: string) => wishlistItems.some((i) => i._id === id),
    [wishlistItems]
  );

  /** Serverdan mahsulot narxi/rasmini yangilab, wishlist ni sync qiladi (seller o'zgartirsa customer ko'radi). */
  const refreshWishlist = useCallback(async () => {
    if (!userId || wishlistItems.length === 0) return;
    const results = await Promise.allSettled(
      wishlistItems.map((item) => productService.getProduct(item._id))
    );
    const updated: WishlistItem[] = wishlistItems.map((item, index) => {
      const result = results[index];
      if (result.status === "fulfilled" && result.value) {
        const p = result.value;
        return {
          _id: p._id,
          name: p.productName ?? item.name,
          price: p.productPrice ?? item.price,
          image: Array.isArray(p.productImages) && p.productImages[0] ? p.productImages[0] : item.image,
          collection: String(p.productCollection ?? item.collection),
        };
      }
      return item;
    });
    setWishlistItems(updated);
    persist(updated);
  }, [userId, wishlistItems, persist]);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    refreshWishlist,
    isSignedIn: !!userId,
  };
}
