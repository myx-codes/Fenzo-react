import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
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
    <Container maxWidth="sm">
      <Box sx={{  py: 6 }}>
        <Typography variant="h5" gutterBottom>
          {t("loginTitle")}
        </Typography>
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
            type="password"
            label={t("password")}
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{bgcolor: "#2a5298", color: "white", mt: 3 }}
          >
            {loading ? t("signingIn") : t("login")}
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
            onClick={() => history.push("/signup")}
          >
            {t("dontHaveAccount")}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
