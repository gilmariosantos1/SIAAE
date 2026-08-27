import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../theme/header.css'
import { IonIcon } from '@ionic/react';
import { restaurantOutline } from "ionicons/icons";

const Header = () => {
    const history = useHistory();
    const { user, signed, logout } = useAuth();

    const handleHome = () => {
        history.push('/')
    }
    const handleSugestoes = () => {
        history.push('/DuvidasSugestoes');
    }
    const handleLogin = () => {
        history.push('/login');
    }
    const handleCadastro = () => {
        history.push('/cadastro');
    }
    const handlePainelAtendente = () => {
        history.push('/painelatendente');
    }
    const handleSair = () => {
        logout();
        history.push('/login');
    }
    const handleAgendamentos = () => {
        history.push('/meus-agendamentos');
    }
    const handleCarrinho = () => {
        history.push('/carrinho');
    }
    const openDrop = () => {
        const drop = document.getElementById("menu_drop");
        drop.classList.toggle("ativo");
    }
    

    return (
        <>
            <header>
                <div onClick={handleHome} className="logo">
                    <span><IonIcon icon={restaurantOutline} /></span>
                    <span>SEAAE</span>
                </div>
                <nav>
                    <div onClick={handleHome} className="cardapio nav_itens">
                        <h3>Cardapio</h3>
                    </div>
                    <div onClick={handleSugestoes} className="sugestoes nav_itens">
                        <h3>Sugestões</h3>
                    </div>                
                    {signed ? (
                        <div onClick={openDrop} className="perfil">
                            <p>{user.nome}</p>
                            <div className="adm">{user.perfil}</div>
                        </div>
                    ) : (
                        <div className="login_cadastro">
                            <p onClick={handleLogin}>Login</p>
                            <span></span>
                            <p onClick={handleCadastro}>Cadastro</p>
                        </div>
                    )}
                </nav>
                <div id="menu_drop">
                    {(user?.perfil === 'ADMIN' || user?.perfil === 'FUNCIONARIO') && (
                        <div onClick={handlePainelAtendente} className="menu_drop_item">
                            <div>Painel do Atendente</div>
                        </div>
                    )}
                    <div onClick={handleSair} className="menu_drop_item">
                        <div>Sair da Conta</div>
                    </div>
                </div>
            </header>
        </>
    )

}

export default Header;