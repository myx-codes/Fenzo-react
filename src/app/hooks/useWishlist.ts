import { useState, useCallback, useEffect } from "react";
import { WishlistItem } from "../../lib/types/wishlist";

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

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    isSignedIn: !!userId,
  };
}
