import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";

export function Login() {
  const history = useHistory();
  const { login, t } = useGlobals();
  const [userNick, setUserNick] = useState("");
  const [userPassword, setUserPassword] = useState("");
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
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        Messages.errorLogin;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #16396d 0%, #2a5298 40%, #eef3fb 40%, #eef3fb 100%)",
        display: "flex",
        alignItems: "center",
        py: { xs: 2, sm: 5 },
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
              {t("loginTitle")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#60738d" }}>
              Fenzo аккаунтига киринг
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
              size="medium"
            />
            <TextField
              fullWidth
              type="password"
              label={t("password")}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              size="medium"
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
              {loading ? t("signingIn") : t("login")}
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1.2, textTransform: "none", fontWeight: 600 }}
              onClick={() => history.push("/signup")}
            >
              {t("dontHaveAccount")}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
