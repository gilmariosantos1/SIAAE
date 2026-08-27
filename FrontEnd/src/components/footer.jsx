import React from "react";
import "../theme/footer.css";
// import icon1 from "../assets/icon-insta.png";
// import icon2 from "../assets/Facebook.png";
// import icon3 from "../assets/icon-X.png";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top-container">
        <div className="footer-top">
          
          {/* ESQUERDA */}
          <div className="footer-left">
            <div className="logo">Fecomércio SE</div>

            <p className="subtitle">
              CNC Sesc Senac <br />
              Sindicatos | Instituto Fecomércio
            </p>
          </div>

          {/* DIREITA */}
          <div className="footer-right">
            <h3>N.S. GLÓRIA</h3>
            <div className="divider" />

            <p>
              Rua Manoel Francisco de Andrade, nº 100 <br />
              Bairro Silo | N.S. Glória <br />
              CEP: 49.680-000 <br />
              (79) 3411-4400 <br />
              Whatsapp (79) 99867-3337
            </p>
          </div>
        </div>

        {/* TEXTO CENTRAL PEQUENO */}
        <div className="footer-note">
          Desenvolvido pelas turmas de TI (2025) e Assist. Administrativo (2026) — Senac/SE, N. Sra. da Glória
        </div>
      </div>

    </footer>
  );
};

export default Footer;