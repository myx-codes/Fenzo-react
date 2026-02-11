import { createSlice } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";


const initialState: ProductsPageState = {
    products: [],
    productCard: null,
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
    }
});

export const { setProducts, setProductCard} = productPageSlice.actions;

const ProductPageReducer = productPageSlice.reducer;
export default ProductPageReducer;