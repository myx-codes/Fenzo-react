import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";

export function Login() {
  const history = useHistory();
  const { login, t } = useGlobals();

  const [userNick, setUserNick] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userNick.trim() || !userPassword) {
      setError(Messages.errorValidation);
      return;
    }

    setLoading(true);
    try {
      await login({ userNick: userNick.trim(), userPassword });
      history.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          Messages.errorLogin
      );
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: "#FAFAF8",
      fontSize: "0.95rem",
      transition: "all 0.2s ease",
      "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
      "&:hover fieldset": { borderColor: "#C8960C" },
      "&.Mui-focused": {
        bgcolor: "#FFFFFF",
        "& fieldset": { borderColor: "#C8960C", borderWidth: "2px" },
      },
    },
    "& .MuiInputBase-input": {
      py: 1.6,
      color: "#1C1917",
      "&::placeholder": { color: "#C4BAB4", opacity: 1 },
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px #FAFAF8 inset",
      WebkitTextFillColor: "#1C1917",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FAFAF8",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: { md: "44%", lg: "46%" },
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          p: { md: 7, lg: 9 },
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #FDF8F0 0%, #FAF4E8 50%, #F5EDD8 100%)",
          borderRight: "1px solid rgba(200,150,12,0.12)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 10% 60%, rgba(200,150,12,0.10) 0%, transparent 55%)," +
              "radial-gradient(ellipse at 90% 10%, rgba(200,150,12,0.07) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                bgcolor: "#C8960C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(200,150,12,0.30)",
              }}
            >
              <Typography sx={{ color: "#FFFFFF", fontWeight: 900, fontSize: 20 }}>
                F
              </Typography>
            </Box>
            <Typography sx={{ color: "#1C1917", fontWeight: 800, fontSize: "1.25rem" }}>
              Fenzo
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#1C1917",
              fontWeight: 800,
              fontSize: { md: "1.85rem", lg: "2.1rem" },
              lineHeight: 1.28,
              mb: 1.5,
            }}
          >
            Welcome{" "}
            <Box component="span" sx={{ color: "#C8960C" }}>
              back
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#78716C",
              fontSize: "0.95rem",
              lineHeight: 1.75,
              mb: 4.5,
              maxWidth: 300,
            }}
          >
            Sign in to your account and enjoy all the features we offer.
          </Typography>

          {[
            "Access your personal dashboard",
            "Track your orders in real time",
            "Enjoy exclusive offers & discounts",
          ].map((text) => (
            <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.8 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  bgcolor: "rgba(200,150,12,0.12)",
                  border: "1px solid rgba(200,150,12,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#C8960C" }} />
              </Box>
              <Typography sx={{ color: "#78716C", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "center",
          p: { xs: 2, sm: 4, md: 6 },
          bgcolor: "#FAFAF8",
          overflowY: "auto",
        }}
      >
        <Container maxWidth="xs" disableGutters sx={{ width: "100%", maxWidth: "420px !important" }}>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "center",
              gap: 1.2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                bgcolor: "#C8960C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(200,150,12,0.30)",
              }}
            >
              <Typography sx={{ color: "#FFFFFF", fontWeight: 900, fontSize: 18 }}>
                F
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#1C1917" }}>
              Fenzo
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "24px",
              border: "1px solid rgba(200,150,12,0.12)",
              p: { xs: 3.5, sm: 4.5 },
              boxShadow:
                "0 2px 4px rgba(0,0,0,0.02), 0 20px 60px rgba(200,150,12,0.08), 0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.75rem",
                  color: "#1C1917",
                  lineHeight: 1.15,
                  mb: 0.7,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  letterSpacing: "-0.025em",
                }}
              >
                {t("loginTitle")}
              </Typography>
              <Typography sx={{ color: "#A8A29E", fontSize: "0.875rem", lineHeight: 1.6 }}>
                Enter your credentials to continue
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{
                  mb: 3,
                  borderRadius: "12px",
                  bgcolor: "rgba(220,38,38,0.04)",
                  border: "1px solid rgba(220,38,38,0.15)",
                  color: "#DC2626",
                  fontSize: "0.875rem",
                  "& .MuiAlert-icon": { color: "#DC2626" },
                  "& .MuiAlert-action": { pt: 0 },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#78716C",
                    mb: 0.8,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Username
                </Typography>
                <TextField
                  fullWidth
                  value={userNick}
                  onChange={(e) => setUserNick(e.target.value)}
                  placeholder="your_username"
                  required
                  autoComplete="username"
                  sx={inputSx}
                />
              </Box>

              <Box sx={{ mb: 3.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#78716C",
                    mb: 0.8,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: "#C4BAB4", "&:hover": { color: "#C8960C" } }}
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 18 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={!loading && <ArrowIcon sx={{ fontSize: "17px !important" }} />}
                sx={{
                  background: "linear-gradient(135deg, #C8960C 0%, #A67C0A 100%)",
                  color: "#FFFFFF",
                  minHeight: 52,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(200,150,12,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #D9A212, #C8960C)",
                    boxShadow: "0 6px 28px rgba(200,150,12,0.45)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                  "&:disabled": {
                    bgcolor: "#EDE9E3",
                    color: "#B8AFA8",
                    boxShadow: "none",
                    background: "none",
                  },
                  transition: "all 0.2s ease",
                  mb: 2,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: "#B8AFA8" }} /> : "Sign In"}
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2.5 }}>
                <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.07)" }} />
                <Typography sx={{ color: "#C4BAB4", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.07)" }} />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => history.push("/signup")}
                sx={{
                  minHeight: 50,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  borderRadius: "12px",
                  borderColor: "rgba(0,0,0,0.1)",
                  color: "#78716C",
                  bgcolor: "#FAFAF8",
                  "&:hover": {
                    borderColor: "#C8960C",
                    bgcolor: "rgba(200,150,12,0.04)",
                    color: "#1C1917",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Don't have an account?{" "}
                <Box component="span" sx={{ color: "#C8960C", fontWeight: 700, ml: 0.5 }}>
                  Sign Up
                </Box>
              </Button>
            </form>
          </Box>

          <Typography sx={{ textAlign: "center", mt: 3, fontSize: "0.75rem", color: "#C4BAB4" }}>
            By signing in you agree to our{" "}
            <Box component="span" sx={{ color: "#C8960C", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              Terms of Service
            </Box>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}