import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { HelpPage } from "./screens/helpPage";
import { MyPage } from "./screens/myPage";
import CheckoutPage from "./screens/checkoutPage/CheckoutPage";
import { Login, Signup } from "./components/Auth";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { Footer } from "./components/footer";
import ContextProvider from "./context/ProviderContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SellerPage } from "./screens/sellerPage/SellerPage";
import { SocketProvider } from "./context/SocketContext";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import "../css/home.css";
import "../css/products.css";
import "../css/mypage.css";
import "../css/basket.css";
import "../css/seller.css";

function App() {
  const location = useLocation();

  return (
    <ContextProvider>
      <CartProvider>
        <SocketProvider>
        <WishlistProvider>
        {location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />}
        <Switch>
          <Route path="/products" component={ProductsPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/profile" component={MyPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/user/seller/:id" component={SellerPage} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/" component={HomePage} />
        </Switch>
        <Footer />
        </WishlistProvider>
        </SocketProvider>
      </CartProvider>
    </ContextProvider>
  );
}

export default App;