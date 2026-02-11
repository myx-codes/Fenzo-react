import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";



const selectHomePage = ( state: AppRootState) => state.homePage;

export const retrieveFeaturedProducts = createSelector(
    selectHomePage,
    (HomePage) => HomePage.featuredProducts
);

export const retrieveTopSellers = createSelector(
    selectHomePage,
    (HomePage) => HomePage.topSellers
);

export const retrieveBestProducts = createSelector(
    selectHomePage,
    (HomePage) => HomePage.bestProducts
);