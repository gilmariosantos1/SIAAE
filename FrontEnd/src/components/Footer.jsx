import React from "react";
import "../theme/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top-container">
        <div className="footer-top">
          
          {/* ESQUERDA */}
          <div className="footer-left">
            <div className="logo">SEAEE</div>

            <p className="subtitle">
              SEMEC <br />
              Secretaria Municipal de Educação e Cultura <br />
            </p>
          </div>

          {/* DIREITA */}
          <div className="footer-right">
            <h3>N.S. GLÓRIA</h3>
            <div className="divider" />

            <p>
              Avenida Simplício Franciso de Souza, nº 61 <br />
              Centro | N.S. Glória <br />
              CEP: 49.680-000 <br />
              (79) 3411-0000 <br />
              Whatsapp (79) 99867-0000
            </p>
          </div>
        </div>

        {/* TEXTO CENTRAL PEQUENO */}
        <div className="footer-note">
          Desenvolvido pro Gilmario dos Santos - 2026 | Todos os direitos reservados
        </div>
      </div>

    </footer>
  );
};

export default Footer;