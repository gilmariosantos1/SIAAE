import { IonButton, IonContent, IonPage } from "@ionic/react";
import "../theme/Student-pages.css";
import "../theme/DuvidasSugestoes.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function ThankYou() {
  return (
    <IonPage>
      <Header />
      <IonContent>
        <main className="student-shell thank-you">
          <div className="thank-emoji">🌟</div>
          <p className="eyebrow">AVALIAÇÃO ENVIADA</p>
          <h1>Obrigado por contribuir!</h1>
          <p>Sua opinião ajuda a melhorar nossa alimentação escolar.</p>
          <IonButton routerLink="/home">Voltar ao cardápio</IonButton>
        </main>
      </IonContent>
      <Footer />
    </IonPage>
  );
}
