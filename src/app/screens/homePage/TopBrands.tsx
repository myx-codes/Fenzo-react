import React from "react";
import { Container, Typography } from "@mui/material";

const stores = [
  // --- SPORt ---
  { id: 1, name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { id: 2, name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { id: 4, name: "Reebok", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Reebok_2019_logo.svg" },
  { id: 5, name: "Fila", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Fila_logo.svg" },

  // --- FAST FASHION (Kundalik) ---
  { id: 7, name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
  { id: 8, name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
  { id: 9, name: "Uniqlo", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg" },
  { id: 12, name: "Calvin Klein", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Calvin_klein_logo.svg" },

  // --- LUXURY (Qimmatbaho) ---
  { id: 13, name: "Gucci", logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg" },
  { id: 14, name: "Chanel", logo: "https://upload.wikimedia.org/wikipedia/en/9/92/Chanel_logo_interlocking_cs.svg" },
  { id: 16, name: "Prada", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Prada-Logo.svg" },
  { id: 18, name: "Dior", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
];

export function TopBrands() {
  return (
    <section className="trusted-section">
      <Container>
        <Typography variant="h1" className="trusted-title">
          Top Brands
        </Typography>
      </Container>
      <div className="slider-wrapper">
        <div className="slider">
          <div className="slide-track">
            
            {stores.map((store) => (
              <div className="slide" key={`first-${store.id}`}>
                <img src={store.logo} alt={store.name} />
              </div>
            ))}

            {stores.map((store) => (
              <div className="slide" key={`second-${store.id}`}>
                <img src={store.logo} alt={store.name} />
              </div>
            ))}

            {stores.map((store) => (
              <div className="slide" key={`third-${store.id}`}>
                <img src={store.logo} alt={store.name} />
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}