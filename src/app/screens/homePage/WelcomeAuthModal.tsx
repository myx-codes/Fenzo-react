import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  useTheme, 
  useMediaQuery 
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


export function WelcomeAuthModal() {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Default: Signup (Birinchi marta kirganda)

  useEffect(() => {
    // Saytga kirganda modalni ochish (faqat 1-marta)
    const hasSeen = sessionStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("hasSeenWelcomeModal", "true");
  };

  const theme = useTheme();
  // Agar ekran kichkina bo'lsa (mobil), modal to'liq ekran bo'lmaydi, lekin chiroyli turadi
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: { borderRadius: 16, overflow: "hidden" } // Burchaklarni silliqlash
      }}
    >
      <div className="modal-wrapper">
        
        <div className="auth-promo-side"
        style={{ backgroundImage: "url('/img/auth-img4.jpg')" }}
        >
          {!isLogin ? (
            <>
              <Typography style={{marginTop:"30px"}} className="promo-title">Signup and Take </Typography>
    
              
              {/* Qizil Voucher Doirasi */}
              <div className="voucher-circle">
                <span className="voucher-text">30% Vaucher</span>
              </div>
              
              <Typography className="promo-desc" style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                *Valid for your first purchase upon registration.
              </Typography>
            </>
          ) : (
            <>
              <Typography className="promo-title">Enjoy Shopping!</Typography>
              <Typography className="promo-desc">
                Ready to find your next favorite style?
              </Typography>
             
            </>
          )}
        </div>

        {/* --- O'NG TARAF: SIGNUP / LOGIN FORM --- */}
        <div className="auth-form-side">
          
          <IconButton onClick={handleClose} className="close-btn">
            <CloseIcon />
          </IconButton>

          {/* TEPADAGI SWITCHER */}
          <div className="auth-tabs">
            <button 
              className={`tab-btn ${!isLogin ? "active" : ""}`} 
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            <button 
              className={`tab-btn ${isLogin ? "active" : ""}`} 
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
          </div>

          <Box className="input-group">
            {!isLogin && (
              <TextField 
                label="Full Name" 
                variant="outlined" 
                fullWidth 
                size="small"
              />
            )}
            <TextField 
              label="Phone number" 
              type="tel"
              variant="outlined" 
              fullWidth 
              size="small"
            />
            <TextField 
              label="Password" 
              type="password" 
              variant="outlined" 
              fullWidth 
              size="small"
            />
          </Box>

          <Button variant="contained" fullWidth className="primary-btn">
            {isLogin ? "Sign In" : "Get My 30% OFF"}
          </Button>
        </div>

      </div>
    </Dialog>
  );
}