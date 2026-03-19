import { useMediaQuery, useTheme } from "@mui/material";

export function useDeviceType() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isTouchLayout = useMediaQuery(theme.breakpoints.down("lg"));

  return {
    isMobile,
    isTablet,
    isTouchLayout,
    isDesktop: !isTouchLayout,
  };
}
