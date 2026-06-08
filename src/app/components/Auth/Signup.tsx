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
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowForward as ArrowIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";

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
    { score: 0, label: "", color: "#EDE9E3" },
    { score: 1, label: "Very weak", color: "#EF4444" },
    { score: 2, label: "Weak", color: "#F59E0B" },
    { score: 3, label: "Fair", color: "#F59E0B" },
    { score: 4, label: "Strong", color: "#22C55E" },
    { score: 5, label: "Very strong", color: "#22C55E" },
  ];

  return map[s];
}

export function Signup() {
  const history = useHistory();
  const { signup, t } = useGlobals();

  const [userNick, setUserNick] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(userPassword);
  const pwMatch = confirmPassword.length > 0 && userPassword === confirmPassword;
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

  const confirmInputSx = {
    ...inputSx,
    "& .MuiOutlinedInput-root": {
      ...inputSx["& .MuiOutlinedInput-root"],
      ...(pwMatch && {
        "& fieldset": { borderColor: "#22C55E", borderWidth: "2px" },
      }),
      ...(pwMismatch && {
        "& fieldset": { borderColor: "#EF4444", borderWidth: "2px" },
      }),
    },
  };

  const labelSx = {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#78716C",
    mb: 0.8,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
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
              "radial-gradient(ellipse at 15% 60%, rgba(200,150,12,0.10) 0%, transparent 55%)," +
              "radial-gradient(ellipse at 85% 10%, rgba(200,150,12,0.07) 0%, transparent 50%)",
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
            }}
          >
            Create an account in minutes and unlock all the features of our platform.
          </Typography>

          {[
            "Quick and easy registration",
            "Your data is always protected",
            "Special discounts and offers",
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
            <Box sx={{ mb: 3.5 }}>
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
                {t("signupTitle")}
              </Typography>
              <Typography sx={{ color: "#A8A29E", fontSize: "0.875rem", lineHeight: 1.6 }}>
                Fill in the details below to get started
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
              <Box sx={{ mb: 2.2 }}>
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
                        <PersonIcon sx={{ color: "#C4BAB4", fontSize: 19 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              <Box sx={{ mb: 2.2 }}>
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
                        <PhoneIcon sx={{ color: "#C4BAB4", fontSize: 19 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              <Box sx={{ mb: 2.2 }}>
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
                        <LockIcon sx={{ color: "#C4BAB4", fontSize: 19 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPw((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: "#C4BAB4", "&:hover": { color: "#C8960C" } }}
                        >
                          {showPw ? (
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

                {userPassword && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: "flex", gap: 0.5, mb: 0.4 }}>
                      {[1, 2, 3, 4, 5].map((seg) => (
                        <Box
                          key={seg}
                          sx={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            bgcolor: strength.score >= seg ? strength.color : "#EDE9E3",
                            transition: "background-color 0.3s ease",
                          }}
                        />
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: strength.color }}>
                      {strength.label}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 3.5 }}>
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
                        <LockIcon sx={{ color: "#C4BAB4", fontSize: 19 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                          {pwMatch && <CheckIcon sx={{ fontSize: 17, color: "#22C55E" }} />}
                          <IconButton
                            onClick={() => setShowCpw((p) => !p)}
                            edge="end"
                            size="small"
                            sx={{ color: "#C4BAB4", "&:hover": { color: "#C8960C" } }}
                          >
                            {showCpw ? (
                              <VisibilityOff sx={{ fontSize: 18 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={confirmInputSx}
                />
                {pwMismatch && (
                  <Typography sx={{ fontSize: "0.72rem", color: "#EF4444", fontWeight: 500, mt: 0.5 }}>
                    Passwords do not match
                  </Typography>
                )}
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
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "#B8AFA8" }} />
                ) : (
                  "Create Account"
                )}
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
                onClick={() => history.push("/login")}
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
                Already have an account?{" "}
                <Box component="span" sx={{ color: "#C8960C", fontWeight: 700, ml: 0.5 }}>
                  Sign In
                </Box>
              </Button>
            </form>
          </Box>

          <Typography sx={{ textAlign: "center", mt: 3, fontSize: "0.75rem", color: "#C4BAB4" }}>
            By creating an account you agree to our{" "}
            <Box component="span" sx={{ color: "#C8960C", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              Terms of Service
            </Box>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}