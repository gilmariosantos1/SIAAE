import { useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { calendarOutline, chatbubbleEllipsesOutline, chevronForward } from 'ionicons/icons';
import { getTodayMenus, Menu } from '../services/menuService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../theme/Home.css';

const Home: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodayMenus().then(setMenus).finally(() => setLoading(false));
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent>
        <main className="home-shell">
          <section className="welcome-block">
            <p className="eyebrow">CARDÁPIO DE HOJE</p>
            <h1>O que tem na escola?</h1>
            <p className="intro">Confira a refeição de hoje e conte para a gente como ela estava.</p>
          </section>

          <section className="menu-list" aria-label="Cardápio do dia">
            {loading ? <div className="loading"><IonSpinner name="crescent" /> Carregando cardápio...</div> : menus.map((menu) => (
              <article className="menu-card" key={menu.id}>
                <div className="menu-card-top">
                  <div>
                    <span className="meal-label">{menu.meal}</span>
                    <h2>{menu.dish}</h2>
                  </div>
                  <div className="date-badge"><IonIcon icon={calendarOutline} /><span>{menu.shift}</span></div>
                </div>
                <p className="school-name">{menu.school}</p>
                {menu.ingredients && <p className="ingredients">{menu.ingredients}</p>}
                <IonButton expand="block" className="evaluate-button" routerLink={`/avaliar/${menu.id}`}>
                  Avaliar esta refeição <IonIcon slot="end" icon={chevronForward} />
                </IonButton>
              </article>
            ))}
          </section>

          <nav className="quick-actions" aria-label="Ações rápidas">
            <IonButton fill="clear" routerLink="/cardapio-semana"><IonIcon icon={calendarOutline} /> Cardápio da semana</IonButton>
            <IonButton fill="clear" routerLink="/fale-com-nutricao"><IonIcon icon={chatbubbleEllipsesOutline} /> Fale com a nutrição</IonButton>
          </nav>
        </main>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Home;
