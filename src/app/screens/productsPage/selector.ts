import { createSelector } from "@reduxjs/toolkit";
import { AppRootState } from "../../../lib/types/screen";



const selectProductsPage = (state: AppRootState) => state.productsPage;

export const retrieveProducts = createSelector(
    selectProductsPage,
    (ProductsPage) => ProductsPage.products
);

export const retrieveProductCard = createSelector(
    selectProductsPage,
    (ProductsPage) => ProductsPage.productCard
);