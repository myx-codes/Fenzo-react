import React from "react";
import { Container, Typography } from "@mui/material";

const stores = [
  { id: 1, name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { id: 2, name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { id: 3, name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
  { id: 4, name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
  { id: 5, name: "Gucci", logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg" },
  { id: 6, name: "Chanel", logo: "https://upload.wikimedia.org/wikipedia/en/9/92/Chanel_logo_interlocking_cs.svg" },
];

export function TopBrands() {
  return (
    <section className="trusted-section">
      <Container>
        <Typography variant="h4" className="trusted-title">
          Top Brands
        </Typography>

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
      </Container>
    </section>
  );
}