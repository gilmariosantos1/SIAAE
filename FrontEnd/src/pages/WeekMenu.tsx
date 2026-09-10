import { useEffect, useState } from "react";
import { IonButton, IonContent, IonPage, IonSpinner } from "@ionic/react";
import { getWeekMenus, Menu } from "../services/menuService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../theme/Student-pages.css";
import "../theme/DuvidasSugestoes.css";
export default function WeekMenu() {
  const [menus, setMenus] = useState<Menu[]>([]);
  useEffect(() => {
    getWeekMenus().then(setMenus);
  }, []);
  return (
    <IonPage>
      <Header />
      <IonContent>
        <main className="student-shell">
          <p className="eyebrow">PLANEJE SUA SEMANA</p>
          <h1>Refeições disponíveis</h1>
          {menus.length ? (
            menus.map((menu) => (
              <article className="week-item" key={menu.id}>
                <span>{menu.date}</span>
                <strong>{menu.dish}</strong>
                <small>
                  {menu.school} · {menu.shift} · {menu.meal}
                </small>
              </article>
            ))
          ) : (
            <IonSpinner />
          )}
          <IonButton routerLink="/admin/cardapios">
            Cadastrar cardápio
          </IonButton>
        </main>
      </IonContent>
      <Footer />
    </IonPage>
  );
}
