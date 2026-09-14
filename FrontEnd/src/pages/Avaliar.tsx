import { FormEvent, useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonLabel, IonPage, IonSelect, IonSelectOption, IonSpinner, IonTextarea, useIonRouter } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { submitEvaluation, RatingKey, Ratings } from '../services/studentService';
import { getTodayMenus, Menu } from '../services/menuService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../theme/Home.css';
import '../theme/Student-pages.css';
import '../theme/Avaliar.css';

const criteria: { key: RatingKey; label: string }[] = [
    { key: 'taste', label: 'Você gostou do sabor da merenda?' },
    { key: 'appearance', label: 'A comida estava bonita e convidativa?' },
    { key: 'temperature', label: 'A comida estava quente ou fria na medida certa?' },
    { key: 'quantity', label: 'A quantidade de comida era suficiente?' },
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
    const searchParams = new URLSearchParams(router.routeInfo.search);
    const classId = Number(searchParams.get('classId'));
    const educationStage = searchParams.get('educationStage') ?? '';
    const schoolId = Number(searchParams.get('schoolId'));
    const initialIngredients = searchParams.get('ingredients')?.split('|').filter(Boolean) ?? [];
    const [menus, setMenus] = useState<Menu[]>([]);
    const [menu, setMenu] = useState<Menu>();
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>(initialIngredients);
    const [ratings, setRatings] = useState<Ratings>({ taste: 0, appearance: 0, temperature: 0, quantity: 0 });
    const [suggestion, setSuggestion] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        getTodayMenus().then((menus) => {
            const availableMenus = schoolId ? menus.filter((currentMenu) => currentMenu.schoolId === schoolId) : menus;
            setMenus(availableMenus);
            setMenu(availableMenus.find((currentMenu) => currentMenu.id === menuId) ?? availableMenus[0]);
        });
    }, [menuId, schoolId]);

    useEffect(() => {
        setSubmitted(false);
        const selectedMenu = menus.find((currentMenu) => currentMenu.id === menuId);
        setMenu(selectedMenu ?? menus[0]);
        setSelectedIngredients(searchParams.get('ingredients')?.split('|').filter(Boolean) ?? []);
    }, [menuId, menus]);

    function startNewEvaluation() {
        setRatings({ taste: 0, appearance: 0, temperature: 0, quantity: 0 });
        setSuggestion('');
        setError('');
        setSubmitted(false);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');

        if (Object.values(ratings).some((value) => value === 0)) {
            setError('Escolha uma nota para cada critério.');
            return;
        }

        setSending(true);
        try {
            if (!classId || !educationStage) {
                setError('Informe a turma e a etapa de ensino antes de avaliar.');
                return;
            }
            if (!selectedIngredients.length) {
                setError('Selecione pelo menos um ingrediente usado na refeição.');
                return;
            }
            await submitEvaluation(menuId, ratings, suggestion, classId, educationStage, selectedIngredients);
            setSubmitted(true);
            setRatings({ taste: 0, appearance: 0, temperature: 0, quantity: 0 });
            setSuggestion('');
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
                <main className="student-shell evaluation-page">
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
                            {menu.ingredients.length > 0 && (
                                <p className="ingredients">Cardápio: {menu.ingredients.join(', ')}</p>
                            )}
                            <p className="evaluation-details">
                                <strong>Ingredientes usados:</strong> {selectedIngredients.join(', ') || 'Não informados'}<br />
                                <strong>Etapa:</strong> {educationStage || menu.educationStage}<br />
                                <strong>Turma:</strong> {classId || 'Não informada'}
                            </p>
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
                        {menu && menus.length > 1 && <div className="evaluation-menu-switcher">
                            <IonLabel position="stacked">Refeição para avaliar</IonLabel>
                            <IonSelect value={menu.id} onIonChange={(event) => router.push(`/avaliar/${event.detail.value}?schoolId=${schoolId}&classId=${classId}&educationStage=${encodeURIComponent(educationStage)}`)} interface="popover">
                                {menus.map((availableMenu) => <IonSelectOption key={availableMenu.id} value={availableMenu.id}>{availableMenu.meal} · {availableMenu.dish}</IonSelectOption>)}
                            </IonSelect>
                        </div>}
                        {menu && <div className="evaluation-ingredients">
                            <IonLabel position="stacked">Ingredientes usados nesta refeição</IonLabel>
                            <IonSelect multiple value={selectedIngredients} placeholder="Selecione os ingredientes" onIonChange={(event) => setSelectedIngredients(event.detail.value)} interface="popover">
                                {menu.ingredients.map((ingredient) => <IonSelectOption key={ingredient} value={ingredient}>{ingredient}</IonSelectOption>)}
                            </IonSelect>
                        </div>}
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

                        {submitted && <div className="evaluation-success" role="status">Avaliação enviada. O mesmo contexto será mantido na próxima refeição.</div>}
                        {!submitted ? <IonButton
                            type="submit"
                            expand="block"
                            disabled={sending}
                        >
                            {sending ? 'Enviando...' : 'Enviar avaliação'}
                        </IonButton> : <div className="evaluation-success-actions">
                            <IonButton type="button" fill="outline" expand="block" routerLink="/home">
                                Voltar - Página Inicial
                            </IonButton>
                            <IonButton type="button" expand="block" onClick={startNewEvaluation}>
                                Fazer nova avaliação
                            </IonButton>
                        </div>}
                    </form>
                </main>
            </IonContent>
            <Footer />
        </IonPage>
    );
}