import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const faqData = [
  {
    id: "panel1",
    question: "How can I track my order?",
    answer:
      "You can track your order by clicking on the 'My Orders' section in your profile. We also send a tracking link to your email once the item is shipped.",
  },
  {
    id: "panel2",
    question: "What is the return policy?",
    answer:
      "We offer a 30-day return policy. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange.",
  },
  {
    id: "panel3",
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times may vary depending on the destination.",
  },
  {
    id: "panel4",
    question: "What payment methods do you accept?",
    answer:
      "We accept Visa, MasterCard, PayPal, and Apple Pay. We also offer cash on delivery for selected regions.",
  },
  {
    id: "panel5",
    question: "I forgot my password, what should I do?",
    answer:
      "Click on 'Forgot Password' on the login page. We will send you an email with instructions to reset your password.",
  },
  {
    id: "panel6",
    question: "Can I change my shipping address after placing an order?",
    answer:
      "If your order has not been shipped yet, you can contact our support team to update the address. Once shipped, we cannot change the destination.",
  },
];

export function HelpPage() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="help-page">
      <Container maxWidth="lg" className="help-container">
        <Box className="help-hero">
          <Stack spacing={2} alignItems="center">
            <Typography className="help-kicker">Customer Support</Typography>

            <Typography className="help-title">
              How can we help you?
            </Typography>

            <Typography className="help-subtitle">
              Find answers to common questions or contact our support team.
            </Typography>

            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by question or keyword"
              className="help-search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="help-search-icon" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Box>

        <Box className="help-faq-section">
          <Box className="help-section-head">
            <Typography className="help-section-title">
              Frequently Asked Questions
            </Typography>
          </Box>

          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                className="help-accordion"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="help-expand-icon" />}
                  aria-controls={`${faq.id}-content`}
                  id={`${faq.id}-header`}
                  className="help-accordion-summary"
                >
                  <Typography className="help-question">
                    {faq.question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails className="help-accordion-details">
                  <Typography className="help-answer">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Box className="help-no-result">
              <Typography>No results found for "{searchTerm}"</Typography>
            </Box>
          )}
        </Box>

        <Box className="help-contact-section">
          <Typography className="help-section-title center">
            Still need help?
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper className="help-card" elevation={0}>
                <SupportAgentIcon className="help-card-icon" />
                <Typography className="help-card-title">Call Support</Typography>
                <Typography className="help-card-text">
                  Speak directly to our team.
                </Typography>
                <Button className="help-card-btn" variant="outlined" fullWidth>
                  +1 234 567 890
                </Button>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper className="help-card" elevation={0}>
                <EmailOutlinedIcon className="help-card-icon" />
                <Typography className="help-card-title">Email Us</Typography>
                <Typography className="help-card-text">
                  We reply within 24 hours.
                </Typography>
                <Button className="help-card-btn" variant="outlined" fullWidth>
                  support@fenzo.com
                </Button>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper className="help-card" elevation={0}>
                <ChatBubbleOutlineIcon className="help-card-icon" />
                <Typography className="help-card-title">Live Chat</Typography>
                <Typography className="help-card-text">
                  Chat with our virtual assistant.
                </Typography>
                <Button className="help-main-btn" variant="contained" fullWidth>
                  Start Chat
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}