import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  PersonOutline as PersonIcon,
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  EastRounded as ArrowIcon,
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

  /* ─────────────────────────────────────────
     STYLES
  ───────────────────────────────────────── */
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "#FAF9F7",
      fontSize: "0.95rem",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.12)",
      },
      "&:hover fieldset": {
        borderColor: "#C8960C",
      },
      "&.Mui-focused": {
        bgcolor: "#FFFFFF",
        "& fieldset": {
          borderColor: "#C8960C",
          borderWidth: "1.5px",
        },
      },
    },
    "& .MuiInputBase-input": {
      py: 1.5,
      color: "#1C1917",
      "&::placeholder": {
        color: "#C4BAB4",
        opacity: 1,
      },
    },
  };

  const labelSx = {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#78716C",
    mb: 0.7,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  const primaryBtnSx = {
    bgcolor: "#C8960C",
    color: "#FFFFFF",
    minHeight: 50,
    textTransform: "none" as const,
    fontWeight: 700,
    fontSize: "1rem",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(200,150,12,0.28)",
    "&:hover": {
      bgcolor: "#A67C0A",
      boxShadow: "0 6px 24px rgba(200,150,12,0.38)",
      transform: "translateY(-1px)",
    },
    "&:active": { transform: "translateY(0)" },
    "&:disabled": {
      bgcolor: "#EDE9E3",
      color: "#B8AFA8",
      boxShadow: "none",
    },
    transition: "all 0.2s ease",
  };

  const ghostBtnSx = {
    minHeight: 48,
    textTransform: "none" as const,
    fontWeight: 600,
    fontSize: "0.92rem",
    borderRadius: "10px",
    borderColor: "rgba(0,0,0,0.12)",
    color: "#78716C",
    bgcolor: "#F5F3EF",
    "&:hover": {
      borderColor: "#C8960C",
      bgcolor: "rgba(200,150,12,0.06)",
      color: "#A67C0A",
    },
    transition: "all 0.2s ease",
  };

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FAFAF8",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* ══════════════════════════════════════
          LEFT PANEL  (light warm)
      ══════════════════════════════════════ */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: { md: "44%", lg: "46%" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          p: { md: 7, lg: 9 },
          position: "relative",
          overflow: "hidden",
          /* warm cream gradient */
          background:
            "linear-gradient(145deg, #FDF8F0 0%, #FAF4E8 50%, #F5EDD8 100%)",
          borderRight: "1px solid rgba(200,150,12,0.12)",
        }}
      >
        {/* Soft radial glow */}
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

        {/* Decorative rings */}
        <Box
          sx={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: "1.5px solid rgba(200,150,12,0.12)",
            bottom: -110,
            right: -130,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "1.5px solid rgba(200,150,12,0.09)",
            top: -60,
            left: -70,
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 7,
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              bgcolor: "#C8960C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(200,150,12,0.35)",
            }}
          >
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 900, fontSize: 21 }}
            >
              F
            </Typography>
          </Box>
          <Typography
            sx={{ color: "#1C1917", fontWeight: 800, fontSize: "1.25rem" }}
          >
            Fenzo
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          sx={{
            color: "#1C1917",
            fontWeight: 800,
            fontSize: { md: "1.85rem", lg: "2.1rem" },
            lineHeight: 1.28,
            mb: 1.5,
            position: "relative",
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
            position: "relative",
          }}
        >
          Sign in to your account and enjoy all the features we offer.
        </Typography>

        {/* Feature list */}
        {[
          "Access your personal dashboard",
          "Track your orders in real time",
          "Enjoy exclusive offers & discounts",
        ].map((text) => (
          <Box
            key={text}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1.8,
              position: "relative",
            }}
          >
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
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#C8960C",
                }}
              />
            </Box>
            <Typography
              sx={{ color: "#78716C", fontSize: "0.9rem", lineHeight: 1.5 }}
            >
              {text}
            </Typography>
          </Box>
        ))}

        {/* Trust badge */}
        <Box
          sx={{
            mt: 5,
            px: 2.5,
            py: 1.5,
            borderRadius: "10px",
            bgcolor: "rgba(255,255,255,0.65)",
            border: "1px solid rgba(200,150,12,0.18)",
            backdropFilter: "blur(6px)",
            display: "inline-flex",
            alignItems: "center",
            gap: 1.5,
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex" }}>
            {["#C8960C", "#E0AA3E", "#F0C96A"].map((c, i) => (
              <Box
                key={c}
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: c,
                  border: "2px solid #FDF8F0",
                  ml: i === 0 ? 0 : "-8px",
                }}
              />
            ))}
          </Box>
          <Typography sx={{ color: "#78716C", fontSize: "0.8rem" }}>
            Trusted by{" "}
            <Box component="span" sx={{ color: "#C8960C", fontWeight: 700 }}>
              10,000+
            </Box>{" "}
            users
          </Typography>
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          RIGHT FORM PANEL
      ══════════════════════════════════════ */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4, md: 6 },
          bgcolor: "#FAFAF8",
          overflowY: "auto",
        }}
      >
        <Container maxWidth="xs" disableGutters>
          {/* Mobile brand */}
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
              <Typography
                sx={{ color: "#FFFFFF", fontWeight: 900, fontSize: 18 }}
              >
                F
              </Typography>
            </Box>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#1C1917" }}
            >
              Fenzo
            </Typography>
          </Box>

          {/* ── Card ── */}
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.07)",
              p: { xs: 3, sm: 4 },
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.07)",
            }}
          >
            {/* Card header */}
            <Box sx={{ mb: 3.5 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 46,
                  height: 46,
                  borderRadius: "12px",
                  bgcolor: "rgba(200,150,12,0.09)",
                  border: "1px solid rgba(200,150,12,0.18)",
                  mb: 2,
                }}
              >
                <LockIcon sx={{ color: "#C8960C", fontSize: 22 }} />
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "#1C1917",
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {t("loginTitle")}
              </Typography>
              <Typography sx={{ color: "#A8A29E", fontSize: "0.88rem" }}>
                Enter your credentials to continue
              </Typography>
            </Box>

            {/* Error alert */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{
                  mb: 2.5,
                  borderRadius: "10px",
                  bgcolor: "rgba(220,38,38,0.05)",
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
            {/* Username */}
            <Box sx={{ mb: 2.2 }}>
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#78716C",
                  mb: 0.7,
                  letterSpacing: "0.05em",
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#FAF9F7",
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    "&:hover fieldset": { borderColor: "#C8960C" },
                    "&.Mui-focused": {
                      bgcolor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#C8960C",
                        borderWidth: "1.5px",
                      },
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: 1.5,
                    color: "#1C1917",
                    "&::placeholder": { color: "#C4BAB4", opacity: 1 },
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #FAF9F7 inset",
                    WebkitTextFillColor: "#1C1917",
                    caretColor: "#1C1917",
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#78716C",
                  mb: 0.7,
                  letterSpacing: "0.05em",
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
                        sx={{
                          color: "#C4BAB4",
                          "&:hover": { color: "#C8960C" },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 19 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 19 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#FAF9F7",
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    "&:hover fieldset": { borderColor: "#C8960C" },
                    "&.Mui-focused": {
                      bgcolor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#C8960C",
                        borderWidth: "1.5px",
                      },
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: 1.5,
                    color: "#1C1917",
                    "&::placeholder": { color: "#C4BAB4", opacity: 1 },
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #FAF9F7 inset",
                    WebkitTextFillColor: "#1C1917",
                    caretColor: "#1C1917",
                  },
                }}
              />
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={
                !loading && <ArrowIcon sx={{ fontSize: "18px !important" }} />
              }
              sx={{
                bgcolor: "#C8960C",
                color: "#FFFFFF",
                minHeight: 50,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(200,150,12,0.28)",
                "&:hover": {
                  bgcolor: "#A67C0A",
                  boxShadow: "0 6px 24px rgba(200,150,12,0.38)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&:disabled": {
                  bgcolor: "#EDE9E3",
                  color: "#B8AFA8",
                  boxShadow: "none",
                },
                transition: "all 0.2s ease",
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#B8AFA8" }} />
              ) : (
                "Sign In"
              )}
            </Button>

            <Divider
              sx={{
                my: 2.5,
                fontSize: "0.78rem",
                color: "#C4BAB4",
                "&::before, &::after": { borderColor: "rgba(0,0,0,0.08)" },
              }}
            >
              or
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => history.push("/signup")}
              sx={{
                minHeight: 48,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.92rem",
                borderRadius: "10px",
                borderColor: "rgba(0,0,0,0.12)",
                color: "#78716C",
                bgcolor: "#F5F3EF",
                "&:hover": {
                  borderColor: "#C8960C",
                  bgcolor: "rgba(200,150,12,0.06)",
                  color: "#A67C0A",
                },
                transition: "all 0.2s ease",
              }}
            >
              Don't have an account?{" "}
              <Box
                component="span"
                sx={{ color: "#C8960C", fontWeight: 700, ml: 0.5 }}
              >
                Sign Up
              </Box>
            </Button>
          </form>
          </Box>

          {/* Bottom note */}
          <Typography
            sx={{
              textAlign: "center",
              mt: 2.5,
              fontSize: "0.78rem",
              color: "#A8A29E",
            }}
          >
            By signing in you agree to our{" "}
            <Box
              component="span"
              sx={{
                color: "#C8960C",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Terms of Service
            </Box>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}