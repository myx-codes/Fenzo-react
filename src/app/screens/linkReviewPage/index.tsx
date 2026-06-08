import React, { FormEvent, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

type LinkReviewResult =
  | {
      status: "valid";
      hostname: string;
      protocol: string;
      normalizedUrl: string;
    }
  | {
      status: "invalid";
      message: string;
    };

export function LinkReviewPage() {
  const [linkValue, setLinkValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<LinkReviewResult | null>(null);

  const handleReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedLink = linkValue.trim();

    if (!trimmedLink) {
      setErrorMessage("Please enter a link");
      setResult(null);
      return;
    }

    const normalizedLink = /^https?:\/\//i.test(trimmedLink)
      ? trimmedLink
      : `https://${trimmedLink}`;

    try {
      const reviewedUrl = new URL(normalizedLink);

      setErrorMessage("");
      setResult({
        status: "valid",
        hostname: reviewedUrl.hostname,
        protocol: reviewedUrl.protocol.replace(":", "").toUpperCase(),
        normalizedUrl: reviewedUrl.href,
      });
    } catch (_error) {
      setErrorMessage("");
      setResult({
        status: "invalid",
        message: "Please check the link and try again.",
      });
    }
  };

  const handleReset = () => {
    setLinkValue("");
    setErrorMessage("");
    setResult(null);
  };

  const openReviewedLink = () => {
    if (result?.status !== "valid") {
      return;
    }

    window.open(result.normalizedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="link-review-page">
      <Container maxWidth="lg" className="link-review-container">
        <Box className="link-review-hero">
          <img src="/icons/logo2.png" alt="Fenzo Logo" className="link-review-logo" />

          <Typography className="link-review-kicker">Link Review</Typography>
          <Typography className="link-review-title">Review a Fenzo link</Typography>
          <Typography className="link-review-subtitle">
            Check a product, order, or support URL before opening it.
          </Typography>
        </Box>

        <Paper className="link-review-panel" elevation={0}>
          <form onSubmit={handleReview} noValidate>
            <Stack className="link-review-form" direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                value={linkValue}
                onChange={(event) => {
                  setLinkValue(event.target.value);
                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
                error={Boolean(errorMessage)}
                helperText={errorMessage || " "}
                placeholder="fenzo.uz/product/1"
                className="link-review-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkOutlinedIcon className="link-review-input-icon" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack className="link-review-actions" direction={{ xs: "row", md: "row" }} spacing={1.25}>
                <Button
                  type="submit"
                  variant="contained"
                  className="link-review-submit"
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  Review Link
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  className="link-review-reset"
                  onClick={handleReset}
                  aria-label="Reset link review"
                >
                  <RestartAltIcon fontSize="small" />
                </Button>
              </Stack>
            </Stack>
          </form>

          <Divider className="link-review-divider" />

          <Box className={`link-review-result ${result ? `is-${result.status}` : "is-empty"}`}>
            {!result ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LinkOutlinedIcon className="link-review-state-icon" />
                <Box>
                  <Typography className="link-review-result-title">Ready to review</Typography>
                  <Typography className="link-review-result-text">
                    Enter a link to see its review result here.
                  </Typography>
                </Box>
              </Stack>
            ) : result.status === "valid" ? (
              <>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircleOutlineIcon className="link-review-state-icon" />
                  <Box>
                    <Typography className="link-review-result-title">Looks valid</Typography>
                    <Typography className="link-review-result-text">
                      This URL has a readable web link format.
                    </Typography>
                  </Box>
                </Stack>

                <Box className="link-review-details">
                  <Box className="link-review-detail">
                    <Typography className="link-review-label">Domain</Typography>
                    <Typography className="link-review-value">{result.hostname}</Typography>
                  </Box>
                  <Box className="link-review-detail">
                    <Typography className="link-review-label">Protocol</Typography>
                    <Typography className="link-review-value">{result.protocol}</Typography>
                  </Box>
                  <Box className="link-review-detail is-wide">
                    <Typography className="link-review-label">Normalized link</Typography>
                    <Typography className="link-review-value is-url">{result.normalizedUrl}</Typography>
                  </Box>
                </Box>

                <Button
                  type="button"
                  variant="outlined"
                  className="link-review-open"
                  onClick={openReviewedLink}
                  endIcon={<OpenInNewIcon />}
                >
                  Open Link
                </Button>
              </>
            ) : (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ErrorOutlineIcon className="link-review-state-icon" />
                <Box>
                  <Typography className="link-review-result-title">Invalid link</Typography>
                  <Typography className="link-review-result-text">{result.message}</Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
