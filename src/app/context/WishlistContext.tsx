import React, { createContext, useContext, ReactNode } from "react";
import useWishlist from "../hooks/useWishlist";
import { useGlobals } from "../hooks/useGlobals";
import { WishlistItem } from "../../lib/types/wishlist";

interface WishlistContextValue {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  refreshWishlist: () => Promise<void>;
  isSignedIn: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { authUser } = useGlobals();
  const userId = authUser?._id ?? null;
  const value = useWishlist(userId);
  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlistContext(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlistContext must be used within WishlistProvider");
  return ctx;
}
