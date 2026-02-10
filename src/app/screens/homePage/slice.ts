import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../../lib/types/screen"

const initialState: HomePageState = {
     featuredProducts: [],
        topSellers: [],
        bigSales: [],
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
        setBigSales: ( state, action) => {
            state.bigSales = action.payload;
        },
    },
});

export const { setFeaturedProducts, setTopSellers, setBigSales} = homePageSlice.actions

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer