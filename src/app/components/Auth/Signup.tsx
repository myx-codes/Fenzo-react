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
  PhoneOutlined as PhoneIcon,
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  EastRounded as ArrowIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";

/* ─── Password strength ─── */
interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

function getStrength(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: "", color: "#EDE9E3" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map: StrengthResult[] = [
    { score: 1, label: "Very weak",  color: "#DC2626" },
    { score: 1, label: "Very weak",  color: "#DC2626" },
    { score: 2, label: "Weak",       color: "#D97706" },
    { score: 3, label: "Fair",       color: "#D97706" },
    { score: 4, label: "Strong",     color: "#16A34A" },
    { score: 5, label: "Very strong",color: "#16A34A" },
  ];
  return map[s];
}

export function Signup() {
  const history = useHistory();
  const { signup, t } = useGlobals();

  const [userNick, setUserNick]               = useState("");
  const [userPhone, setUserPhone]             = useState("");
  const [userPassword, setUserPassword]       = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw]                   = useState(false);
  const [showCpw, setShowCpw]                 = useState(false);
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(false);

  const strength   = getStrength(userPassword);
  const pwMatch    = confirmPassword.length > 0 && userPassword === confirmPassword;
  const pwMismatch = confirmPassword.length > 0 && userPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!userNick.trim() || !userPhone.trim() || !userPassword) {
      setError(Messages.errorValidation);
      return;
    }
    if (userPassword !== confirmPassword) {
      setError(Messages.errorPasswordMatch);
      return;
    }
    setLoading(true);
    try {
      await signup({
        userNick: userNick.trim(),
        userPhone: userPhone.trim(),
        userPassword,
      });
      history.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          Messages.errorUserExists
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

  /* confirm border override */
  const confirmInputSx = {
    ...inputSx,
    "& .MuiOutlinedInput-root": {
      ...inputSx["& .MuiOutlinedInput-root"],
      ...(pwMatch && {
        "& fieldset": { borderColor: "#16A34A", borderWidth: "1.5px" },
      }),
      ...(pwMismatch && {
        "& fieldset": { borderColor: "#DC2626", borderWidth: "1.5px" },
      }),
    },
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
          LEFT PANEL  (light warm cream)
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
          background:
            "linear-gradient(145deg, #FDF8F0 0%, #FAF4E8 50%, #F5EDD8 100%)",
          borderRight: "1px solid rgba(200,150,12,0.12)",
        }}
      >
        {/* Soft glow */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 15% 60%, rgba(200,150,12,0.10) 0%, transparent 55%)," +
              "radial-gradient(ellipse at 85% 10%, rgba(200,150,12,0.07) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Rings */}
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
          Join the{" "}
          <Box component="span" sx={{ color: "#C8960C" }}>
            Fenzo family
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
          Create an account in minutes and unlock all the features of our
          platform.
        </Typography>

        {/* Features */}
        {[
          "Quick and easy registration",
          "Your data is always protected",
          "Special discounts and offers",
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
            <Box sx={{ mb: 3 }}>
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
                <PersonIcon sx={{ color: "#C8960C", fontSize: 22 }} />
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
                {t("signupTitle")}
              </Typography>
              <Typography sx={{ color: "#A8A29E", fontSize: "0.88rem" }}>
                Fill in the details below to get started
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
              <Box sx={{ mb: 2 }}>
                <Typography sx={labelSx}>Username</Typography>
                <TextField
                  fullWidth
                  value={userNick}
                  onChange={(e) => setUserNick(e.target.value)}
                  placeholder="your_username"
                  required
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#C4BAB4", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              {/* Phone */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={labelSx}>Phone Number</Typography>
                <TextField
                  fullWidth
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  required
                  autoComplete="tel"
                  inputProps={{ inputMode: "tel" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#C4BAB4", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              {/* Password */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={labelSx}>Password</Typography>
                <TextField
                  fullWidth
                  type={showPw ? "text" : "password"}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#C4BAB4", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPw((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{
                            color: "#C4BAB4",
                            "&:hover": { color: "#C8960C" },
                          }}
                        >
                          {showPw ? (
                            <VisibilityOff sx={{ fontSize: 19 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 19 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />

                {/* Strength bar */}
                {userPassword && (
                  <Box sx={{ mt: 1.2 }}>
                    <Box sx={{ display: "flex", gap: 0.6, mb: 0.5 }}>
                      {[1, 2, 3, 4, 5].map((seg) => (
                        <Box
                          key={seg}
                          sx={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            bgcolor:
                              strength.score >= seg
                                ? strength.color
                                : "#EDE9E3",
                            transition: "background-color 0.3s ease",
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: strength.color,
                      }}
                    >
                      {strength.label}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Confirm Password */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={labelSx}>Confirm Password</Typography>
                <TextField
                  fullWidth
                  type={showCpw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#C4BAB4", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.3,
                          }}
                        >
                          {pwMatch && (
                            <CheckIcon
                              sx={{ fontSize: 18, color: "#16A34A" }}
                            />
                          )}
                          <IconButton
                            onClick={() => setShowCpw((p) => !p)}
                            edge="end"
                            size="small"
                            sx={{
                              color: "#C4BAB4",
                              "&:hover": { color: "#C8960C" },
                            }}
                          >
                            {showCpw ? (
                              <VisibilityOff sx={{ fontSize: 19 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 19 }} />
                            )}
                          </IconButton>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={confirmInputSx}
                />
                {pwMismatch && (
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      color: "#DC2626",
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  >
                    Passwords do not match
                  </Typography>
                )}
              </Box>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={
                  !loading && (
                    <ArrowIcon sx={{ fontSize: "18px !important" }} />
                  )
                }
                sx={primaryBtnSx}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#B8AFA8" }} />
                ) : (
                  "Create Account"
                )}
              </Button>

              <Divider
                sx={{
                  my: 2.5,
                  fontSize: "0.78rem",
                  color: "#C4BAB4",
                  "&::before, &::after": {
                    borderColor: "rgba(0,0,0,0.08)",
                  },
                }}
              >
                or
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => history.push("/login")}
                sx={ghostBtnSx}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  sx={{ color: "#C8960C", fontWeight: 700, ml: 0.5 }}
                >
                  Sign In
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
            By creating an account you agree to our{" "}
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