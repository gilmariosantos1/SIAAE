import { FormEvent, useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonLabel, IonPage, IonSpinner, IonTextarea, useIonRouter } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { submitEvaluation, RatingKey, Ratings } from '../services/studentService';
import { getTodayMenus, Menu } from '../services/menuService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../theme/Home.css';
import '../theme/Student-pages.css';

const criteria: { key: RatingKey; label: string }[] = [
    { key: 'taste', label: 'Sabor' },
    { key: 'appearance', label: 'Aparência' },
    { key: 'temperature', label: 'Temperatura' },
    { key: 'quantity', label: 'Quantidade' },
];
const faces = [
    { emoji: '😡', description: 'Péssima' },
    { emoji: '🙁', description: 'Ruim' },
    { emoji: '😐', description: 'Regular' },
    { emoji: '🙂', description: 'Boa' },
    { emoji: '😍', description: 'Excelente' },
];

export default function Evaluate() {
    const router = useIonRouter();
    const menuId = Number(router.routeInfo.pathname.split('/').pop());
    const [menu, setMenu] = useState<Menu>();
    const [ratings, setRatings] = useState<Ratings>({ taste: 0, appearance: 0, temperature: 0, quantity: 0 });
    const [suggestion, setSuggestion] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        getTodayMenus().then((menus) => {
            setMenu(menus.find((currentMenu) => currentMenu.id === menuId) ?? menus[0]);
        });
    }, [menuId]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');

        if (Object.values(ratings).some((value) => value === 0)) {
            setError('Escolha uma nota para cada critério.');
            return;
        }

        setSending(true);
        try {
            await submitEvaluation(menuId, ratings, suggestion);
            router.push('/obrigado');
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Não foi possível enviar.',
            );
        } finally {
            setSending(false);
        }
    }

    return (
        <IonPage>
            <Header />
            <IonContent>
                <main className="student-shell">
                    <IonButton
                        className="back-button"
                        fill="clear"
                        routerLink="/home"
                    >
                        Voltar
                    </IonButton>
                    {menu ? (
                        <article className="menu-card evaluation-menu-card">
                            <div className="menu-card-top">
                                <div>
                                    <span className="meal-label">{menu.meal}</span>
                                    <h2>{menu.dish}</h2>
                                </div>
                                <div className="date-badge">
                                    <IonIcon icon={calendarOutline} />
                                    <span>{menu.shift}</span>
                                </div>
                            </div>
                            <p className="school-name">{menu.school}</p>
                            {menu.ingredients && (
                                <p className="ingredients">{menu.ingredients}</p>
                            )}
                        </article>
                    ) : (
                        <div className="loading">
                            <IonSpinner name="crescent" />
                            Carregando refeição...
                        </div>
                    )}
                    <br />
                    <p className="eyebrow">SUA OPINIÃO IMPORTA</p>
                    <h1>Como estava a refeição?</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="evaluation-grid">
                            {criteria.map(({ key, label }) => (
                                <div
                                    className="rating-group"
                                    role="group"
                                    aria-labelledby={`${key}-title`}
                                    key={key}
                                >
                                    <h2 id={`${key}-title`} className="rating-title">
                                        {label}
                                    </h2>
                                    <div className="face-options">
                                        {faces.map(({ emoji, description }, index) => (
                                            <button
                                                type="button"
                                                className={
                                                    ratings[key] === index + 1
                                                        ? 'face selected'
                                                        : 'face'
                                                }
                                                onClick={() =>
                                                    setRatings({
                                                        ...ratings,
                                                        [key]: index + 1,
                                                    })
                                                }
                                                aria-label={`${label}: ${description}`}
                                                key={emoji}
                                            >
                                                <span className="face-emoji">
                                                    {emoji}
                                                </span>
                                                <span className="face-description">
                                                    {description}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="suggestion-item">
                            <IonLabel position="stacked">
                                Sugestão (opcional)
                            </IonLabel>
                            <IonTextarea
                                value={suggestion}
                                maxlength={500}
                                onIonInput={(event) =>
                                    setSuggestion(event.detail.value ?? '')
                                }
                                placeholder="Conte algo que pode melhorar"
                            />
                        </div>

                        {error && (
                            <p className="form-error" role="alert">
                                {error}
                            </p>
                        )}

                        <IonButton
                            type="submit"
                            expand="block"
                            disabled={sending}
                        >
                            {sending ? 'Enviando...' : 'Enviar avaliação'}
                        </IonButton>
                    </form>
                </main>
            </IonContent>
            <Footer />
        </IonPage>
    );
}