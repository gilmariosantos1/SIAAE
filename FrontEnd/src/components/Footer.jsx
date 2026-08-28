import "../theme/Footer.css";
import logo from "../assets/logo_pref_semec.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top-container">
        <div className="footer-top">
          
          {/* ESQUERDA */}
          <div className="footer-left">          
            <img src={logo} alt="SEMEC" className="logo" />

            {/**<p className="subtitle">
              SEMEC <br />
              Secretaria Municipal de Educação e Cultura <br />
            </p> */}

          </div>

          {/* DIREITA 
          <div className="footer-right">
            <h3>N.S. GLÓRIA</h3>
            <div className="divider" />

            <p>
              Avenida Simplício Franciso de Souza, Nº 61 <br />
              Centro | N.S. Glória <br />
              CEP: 49.680-000 <br />              
              Whatsapp (79) 9 9954-8506
            </p>
          </div>*/}
        </div>

        {/* TEXTO CENTRAL PEQUENO */}
        <div className="footer-note">
          Desenvolvido por Gilmario dos Santos - 2026 | Todos os direitos reservados
        </div>
      </div>

    </footer>
  );
};

export default Footer;