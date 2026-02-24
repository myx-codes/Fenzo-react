import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Product } from "../../lib/types/product";
import { BuyNowItem } from "../../lib/types/order";

export function useCreateOrder() {
  const history = useHistory();

  const handleBuyNow = useCallback(
    (product: Pick<Product, "_id" | "productPrice" | "productName" | "productImages">, quantity: number = 1) => {
      const buyNow: BuyNowItem = {
        productId: product._id,
        quantity,
        price: product.productPrice,
        name: product.productName,
        image: product.productImages?.[0],
      };
      history.push("/checkout", { buyNow });
    },
    [history]
  );

  return { handleBuyNow, loading: false, error: null };
}
