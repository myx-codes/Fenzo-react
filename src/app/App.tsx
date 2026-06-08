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
import { MobileHeader } from "./components/headers/MobileHeader";
import { MobileBottomNav } from "./components/headers/MobileBottomNav";
import { Footer } from "./components/footer";
import ContextProvider from "./context/ProviderContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SellerPage } from "./screens/sellerPage/SellerPage";
import { SocketProvider } from "./context/SocketContext";
import { useDeviceType } from "./hooks/useDeviceType";
import { Seo } from "./components/Seo";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import "../css/home.css";
import "../css/products.css";
import "../css/mypage.css";
import "../css/basket.css";
import "../css/seller.css";
import "../css/order.css";
import "../css/mobile-layout.css";
import "../css/help.css";
import "../css/check-out.css";

function App() {
  const location = useLocation();
  const { isTouchLayout } = useDeviceType();

  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";
  const showMobileShell = isTouchLayout;
  const showMobileBottomNav = isTouchLayout && !isAuthRoute;
  const showFooter = !isTouchLayout || isAuthRoute;

  const seoConfig = getSeoConfig(location.pathname);

  return (
    <ContextProvider>
      <CartProvider>
        <SocketProvider>
        <WishlistProvider>
        <Seo {...seoConfig} />
        {showMobileShell ? (
          <MobileHeader />
        ) : (
          location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />
        )}

        <div className={showMobileShell ? "mobile-layout-content" : undefined}>
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
        </div>

        {showFooter && <Footer />}
        {showMobileBottomNav && <MobileBottomNav />}
        </WishlistProvider>
        </SocketProvider>
      </CartProvider>
    </ContextProvider>
  );
}

export default App;

function getSeoConfig(pathname: string) {
  const siteName = "FENZO";
  const baseDescription =
    "FENZO is an online marketplace for electronics, fashion, beauty, home essentials, and daily shopping.";

  if (pathname === "/") {
    return {
      title: `${siteName} | Online Market`,
      description: baseDescription,
    };
  }

  if (pathname.startsWith("/products")) {
    return {
      title: `${siteName} | Products`,
      description: "Browse FENZO products by category and discover the latest deals.",
    };
  }

  if (pathname === "/orders") {
    return {
      title: `${siteName} | Orders`,
      description: "View your order history, delivery status, and purchase details on FENZO.",
      noIndex: true,
    };
  }

  if (pathname === "/help") {
    return {
      title: `${siteName} | Help Center`,
      description: "Find answers to common questions or contact FENZO support.",
    };
  }

  if (pathname === "/profile") {
    return {
      title: `${siteName} | My Profile`,
      description: "Manage your account details, addresses, and preferences on FENZO.",
      noIndex: true,
    };
  }

  if (pathname === "/checkout") {
    return {
      title: `${siteName} | Checkout`,
      description: "Complete your purchase securely with FENZO checkout.",
      noIndex: true,
    };
  }

  if (pathname.startsWith("/user/seller/")) {
    return {
      title: `${siteName} | Seller Profile`,
      description: "Explore seller information and products available on FENZO.",
    };
  }

  if (pathname === "/login") {
    return {
      title: `${siteName} | Login`,
      description: "Sign in to your FENZO account.",
      noIndex: true,
    };
  }

  if (pathname === "/signup") {
    return {
      title: `${siteName} | Sign Up`,
      description: "Create your FENZO account to start shopping.",
      noIndex: true,
    };
  }

  return {
    title: siteName,
    description: baseDescription,
  };
}
