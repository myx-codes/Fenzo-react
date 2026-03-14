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
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// --- MOCK DATA: SAVOL-JAVOBLAR ---
const faqData = [
  {
    id: "panel1",
    question: "How can I track my order?",
    answer: "You can track your order by clicking on the 'My Orders' section in your profile. We also send a tracking link to your email once the item is shipped."
  },
  {
    id: "panel2",
    question: "What is the return policy?",
    answer: "We offer a 30-day return policy. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange."
  },
  {
    id: "panel3",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times may vary depending on the destination."
  },
  {
    id: "panel4",
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, PayPal, and Apple Pay. We also offer cash on delivery for selected regions."
  },
  {
    id: "panel5",
    question: "I forgot my password, what should I do?",
    answer: "Click on 'Forgot Password' on the login page. We will send you an email with instructions to reset your password."
  },
  {
    id: "panel6",
    question: "Can I change my shipping address after placing an order?",
    answer: "If your order has not been shipped yet, you can contact our support team to update the address. Once shipped, we cannot change the destination."
  },
];

export function HelpPage() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Accordionni ochib yopish logikasi
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Qidiruv logikasi
  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="help-page">
      <Container maxWidth="md" sx={{ py: 8 }}>
        
        {/* --- HERO SECTION --- */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#1a1a1a' }}>
                  How can we help you?
              </Typography>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by question or keyword"
                sx={{ maxWidth: 520 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
        </Box>

        {/* --- FAQ SECTION --- */}
        <Box sx={{ mb: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Frequently Asked Questions
            </Typography>
            
            {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                    <Accordion 
                        key={faq.id} 
                        expanded={expanded === faq.id} 
                        onChange={handleChange(faq.id)}
                        sx={{ 
                            mb: 2, 
                            boxShadow: 'none', 
                            border: '1px solid #eee', 
                            borderRadius: '8px !important',
                            '&:before': { display: 'none' } // Chiziqni yo'qotish
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${faq.id}-content`}
                            id={`${faq.id}-header`}
                            sx={{ fontWeight: '600' }}
                        >
                            <Typography sx={{ fontWeight: 500 }}>{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ bgcolor: '#fafafa', borderRadius: '0 0 8px 8px' }}>
                            <Typography color="text.secondary">
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">No results found for "{searchTerm}"</Typography>
                </Box>
            )}
        </Box>

        {/* --- CONTACT SUPPORT CARDS --- */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Still need help?
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
            {/* Call Support */}
            <Grid size={{xs:12, md:4}}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, height: '100%' }} elevation={1}>
                    <SupportAgentIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Call Support</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Speak directly to our team.
                    </Typography>
                    <Button variant="outlined" fullWidth>+1 234 567 890</Button>
                </Paper>
            </Grid>

            {/* Email Support */}
            <Grid size={{xs:12, md:4}}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, height: '100%' }} elevation={1}>
                    <EmailOutlinedIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Email Us</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        We reply within 24 hours.
                    </Typography>
                    <Button variant="outlined" fullWidth>support@fenzo.com</Button>
                </Paper>
            </Grid>

            {/* Live Chat */}
            <Grid size={{xs:12, md:4}}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, height: '100%' }} elevation={1}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Live Chat</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Chat with our virtual assistant.
                    </Typography>
                    <Button variant="contained" fullWidth>Start Chat</Button>
                </Paper>
            </Grid>
        </Grid>

      </Container>
    </div>
  );
}