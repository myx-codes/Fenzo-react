import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useHistory, useLocation } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { TranslationKey } from "../../i18n/translations";

const navItems: Array<{ labelKey: TranslationKey; value: string; icon: React.ReactNode }> = [
  { labelKey: "home", value: "/", icon: <HomeIcon /> },
  { labelKey: "products", value: "/products/ALL", icon: <StorefrontIcon /> },
  { labelKey: "orders", value: "/orders", icon: <ReceiptLongIcon /> },
  { labelKey: "profile", value: "/profile", icon: <PersonIcon /> },
  { labelKey: "help", value: "/help", icon: <HelpOutlineIcon /> },
];

function resolveCurrentPath(pathname: string): string {
  const found = navItems.find((item) => pathname === item.value || pathname.startsWith(item.value + "/"));
  if (found) return found.value;
  if (pathname.startsWith("/products")) return "/products/ALL";
  if (pathname.startsWith("/profile")) return "/profile";
  if (pathname.startsWith("/orders")) return "/orders";
  if (pathname.startsWith("/help")) return "/help";
  return "/";
}

export function MobileBottomNav() {
  const history = useHistory();
  const location = useLocation();
  const { t } = useGlobals();
  const current = resolveCurrentPath(location.pathname);

  return (
    <Paper elevation={8} className="mobile-bottom-nav-wrap">
      <BottomNavigation
        showLabels
        value={current}
        onChange={(_e, value) => history.push(value)}
        className="mobile-bottom-nav"
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={t(item.labelKey)}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
