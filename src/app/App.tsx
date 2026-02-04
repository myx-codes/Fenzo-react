import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { HomePage } from "./screens/homePage";
import { ProducstPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { Footer } from "./components/footer";
import "../css/app.css"
import "../css/navbar.css"
import "../css/footer.css"

function App() {
  const location = useLocation();
  return (
    <>
    {location.pathname === "/" ? <HomeNavbar/> : <OtherNavbar/> }
        <Switch>
          <Route path="/products">
            <ProducstPage />
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/member-page">
            <UserPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
        <Footer/>
      </>
  );
}

function Home() {
  return <Container>Home</Container>;
}

export default App;