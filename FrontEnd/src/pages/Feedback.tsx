import { FormEvent, useState } from 'react';
import { IonButton, IonContent, IonItem, IonLabel, IonPage, IonTextarea } from '@ionic/react';
import { submitFeedback } from '../services/studentService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../theme/student-pages.css';
export default function Feedback() {
  const [type, setType] = useState<'sugestao' | 'reclamacao' | 'elogio'>('sugestao'); const [message, setMessage] = useState(''); const [sent, setSent] = useState(false); const [error, setError] = useState('');
  async function send(event: FormEvent) { event.preventDefault(); setError(''); try { await submitFeedback(type, message); setSent(true); } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Não foi possível enviar.'); } }
  return <IonPage><Header /><IonContent><main className="student-shell"><p className="eyebrow">CANAL ABERTO</p><h1>Quer conversar?</h1>{sent ? <><p className="success-message">Mensagem enviada. Obrigado por participar!</p><IonButton routerLink="/home">Voltar ao início</IonButton></> : <form onSubmit={send}><div className="feedback-types">{(['sugestao', 'reclamacao', 'elogio'] as const).map((option) => <button type="button" className={type === option ? 'type-option active' : 'type-option'} onClick={() => setType(option)} key={option}>{option[0].toUpperCase() + option.slice(1)}</button>)}</div><IonItem className="suggestion-item"><IonLabel position="stacked">Sua mensagem</IonLabel><IonTextarea required minlength={3} maxlength={1000} value={message} onIonInput={(event) => setMessage(event.detail.value ?? '')} /></IonItem>{error && <p className="form-error">{error}</p>}<IonButton type="submit" expand="block">Enviar mensagem</IonButton></form>}</main></IonContent><Footer /></IonPage>;
}