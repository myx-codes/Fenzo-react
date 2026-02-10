import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../../lib/types/screen"

const initialState: HomePageState = {
     featuredProducts: [],
        topSellers: [],
        bestProducts: [],
};

const homePageSlice = createSlice({
    name: "homepage",
    initialState,
    reducers: {
        setFeaturedProducts: ( state, action) => {
            state.featuredProducts = action.payload;
        },
        setTopSellers: ( state, action) => {
            state.topSellers = action.payload;
        },
        setBestProducts: ( state, action) => {
            state.bestProducts = action.payload
        },
    },
});

export const { setFeaturedProducts, setTopSellers, setBestProducts} = homePageSlice.actions

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer