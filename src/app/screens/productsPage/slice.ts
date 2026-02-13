import { createSlice } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";


const initialState: ProductsPageState = {
    products: [],
    productCard: null,
    store: [],
}

const productPageSlice = createSlice({
    name: "productspage",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },

        setProductCard: ( state, action) => {
            state.productCard = action.payload;
        },

        setStore: (state, action) => {
            state.store = action.payload;
        },
    }
});

export const { setProducts, setProductCard, setStore} = productPageSlice.actions;

const ProductPageReducer = productPageSlice.reducer;
export default ProductPageReducer;