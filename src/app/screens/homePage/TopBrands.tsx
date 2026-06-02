import React from "react";
import { Container, Typography } from "@mui/material";

const stores = [
  { id: 1,  name: "Adidas",        logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { id: 2,  name: "Nike",          logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { id: 3,  name: "Reebok",        logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Reebok_2019_logo.svg" },
  { id: 4,  name: "Fila",          logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Fila_logo.svg" },
  { id: 5,  name: "Zara",          logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
  { id: 6,  name: "H&M",           logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
  { id: 7,  name: "Uniqlo",        logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg" },
  { id: 8,  name: "Calvin Klein",  logo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Calvin_klein_logo.svg" },
  { id: 9,  name: "Gucci",         logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg" },
  { id: 10, name: "Chanel",        logo: "https://upload.wikimedia.org/wikipedia/en/9/92/Chanel_logo_interlocking_cs.svg" },
  { id: 11, name: "Prada",         logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Prada-Logo.svg" },
  { id: 12, name: "Dior",          logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
];

export function TopBrands() {
  return (
    <section className="brands-section">
      <Container maxWidth="xl">
        <div className="lp-section-head center">
          <Typography className="lp-section-title">Top Brands</Typography>
          <Typography className="lp-section-sub">
            We partner with world's leading brands
          </Typography>
        </div>
      </Container>

      <div className="brands-track-wrap">
        <div className="brands-track">
          {[...stores, ...stores, ...stores].map((s, i) => (
            <div key={i} className="brand-slide">
              <img src={s.logo} alt={s.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}