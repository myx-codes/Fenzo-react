import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";

export function Signup() {
  const history = useHistory();
  const { signup } = useGlobals();
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
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h5" gutterBottom>
          Sign up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={userNick}
            onChange={(e) => setUserNick(e.target.value)}
            margin="normal"
            required
            autoComplete="username"
          />
          <TextField
            fullWidth
            label="Phone"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            margin="normal"
            required
            autoComplete="tel"
            placeholder="e.g. +998901234567"
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="new-password"
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
            {loading ? "Creating account…" : "Sign up"}
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
            onClick={() => history.push("/login")}
          >
            Already have an account? Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
