import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";

export function Signup() {
  const history = useHistory();
  const { signup, t } = useGlobals();
  const [userNick, setUserNick] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        Messages.errorUserExists;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #16396d 0%, #2a5298 38%, #eef3fb 38%, #eef3fb 100%)",
        display: "flex",
        alignItems: "center",
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 3, sm: 4 },
            border: "1px solid #e4eaf4",
            p: { xs: 2, sm: 4 },
            boxShadow: "0 12px 30px rgba(20, 44, 83, 0.1)",
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#16396d", mb: 0.5 }}>
              {t("signupTitle")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#60738d" }}>
              Fenzo'da yangi akkaunt yarating
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t("username")}
              value={userNick}
              onChange={(e) => setUserNick(e.target.value)}
              margin="normal"
              required
              autoComplete="username"
            />
            <TextField
              fullWidth
              label={t("phone")}
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              margin="normal"
              required
              autoComplete="tel"
              inputProps={{ inputMode: "tel" }}
              placeholder="e.g. 01047799495"
            />
            <TextField
              fullWidth
              type="password"
              label={t("password")}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />
            <TextField
              fullWidth
              type="password"
              label={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />

            {error && (
              <Typography color="error" sx={{ mt: 1, fontSize: "0.92rem" }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: "#2a5298",
                color: "white",
                mt: 3,
                minHeight: 46,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              {loading ? t("creatingAccount") : t("signUp")}
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1.2, textTransform: "none", fontWeight: 600 }}
              onClick={() => history.push("/login")}
            >
              {t("alreadyHaveAccount")}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
