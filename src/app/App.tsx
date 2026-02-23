import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { HelpPage } from "./screens/helpPage";
import { MyPage } from "./screens/myPage";
import { BasketPage } from "./screens/basketPage/BasketPage";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { Footer } from "./components/footer";
import { CartProvider } from "./context/CartContext";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import "../css/home.css";
import "../css/products.css";
import "../css/mypage.css";
import "../css/basket.css";

function App() {
  const location = useLocation();

  return (
    <CartProvider>
      {location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />}
      <Switch>
        <Route path="/products" component={ProductsPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/help" component={HelpPage} />
        <Route path="/profile" component={MyPage} />
        <Route path="/basket" component={BasketPage} />
        <Route path="/" component={HomePage} />
      </Switch>
      <Footer />
    </CartProvider>
  );
}

export default App;