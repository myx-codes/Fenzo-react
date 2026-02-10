import { createSelector } from "reselect";
import { AppRootState } from "../../../../lib/types/screen";
import { HomePage } from ".";


const selectHomePage = ( state: AppRootState) => state.homePage;
const retrieveFeaturedProducts = createSelector(
    selectHomePage,
    (HomePage) => HomePage.featuredProducts
)