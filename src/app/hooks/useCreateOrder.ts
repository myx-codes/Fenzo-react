import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Product } from "../../lib/types/product";
import { BuyNowItem } from "../../lib/types/order";
import { useGlobals } from "./useGlobals";
import { sweetAlert } from "../../lib/sweetalert";

export function useCreateOrder() {
  const history = useHistory();
  const { authUser } = useGlobals();

  const handleBuyNow = useCallback(
    (product: Pick<Product, "_id" | "productPrice" | "productName" | "productImages">, quantity: number = 1) => {
      if (!authUser) {
        sweetAlert
          .warning("Please sign up first", "Register to purchase a product.")
          .then(() => history.push("/signup"));
        return;
      }
      const buyNow: BuyNowItem = {
        productId: product._id,
        quantity,
        price: product.productPrice,
        name: product.productName,
        image: product.productImages?.[0],
      };
      history.push("/checkout", { buyNow });
    },
    [history, authUser]
  );

  return { handleBuyNow, loading: false, error: null };
}
