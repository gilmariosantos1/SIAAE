import { FormEvent, useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle,
} from '@ionic/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createMenu, getSchools, School } from '../services/menuService';
import '../theme/MenuRegistration.css';

const initialForm = {
  schoolIds: [] as string[],
  nutritionistId: '',
  dayOfWeek: '',
  educationStage: '',
  shift: '',
  meal: '',
  dish: '',
  ingredients: '',
  active: true,
};

export function MenuRegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [schools, setSchools] = useState<School[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSchools().then(setSchools).catch((reason: Error) => setError(reason.message));
  }, []);

  const update = (field: keyof typeof initialForm, value: string | string[] | null | undefined) => {
    setForm((current) => ({ ...current, [field]: value ?? '' }));
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      await createMenu({
        schoolIds: form.schoolIds.map(Number),
        nutritionistId: form.nutritionistId ? Number(form.nutritionistId) : undefined,
        dayOfWeek: Number(form.dayOfWeek),
        educationStage: form.educationStage,
        shift: form.shift as 'manha' | 'tarde' | 'noite' | 'integral',
        meal: form.meal,
        dish: form.dish,
        ingredients: form.ingredients.split(',').map((ingredient) => ingredient.trim()).filter(Boolean),
        active: form.active,
      });
      setForm(initialForm);
      setMessage('Cardápio cadastrado com sucesso.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar o cardápio.');
    } finally {
      setSaving(false);
    }
  }

  return (
        <section className="menu-registration-shell">
          <p className="eyebrow">GESTÃO DE CARDÁPIOS</p>
          <h1>Novo cardápio</h1>
          <p className="menu-registration-intro">Registre a refeição que ficará disponível para as escolas.</p>
          <form className="menu-form" onSubmit={submit}>
            <IonItem>
              <IonLabel position="stacked">Escola</IonLabel>
              <IonSelect multiple value={form.schoolIds} placeholder="Selecione as escolas" onIonChange={(event) => update('schoolIds', event.detail.value)} required>
                {schools.map((school) => <IonSelectOption key={school.id} value={String(school.id)}>{school.name}</IonSelectOption>)}
              </IonSelect>
            </IonItem>
            <div className="menu-form-grid">
              <IonItem>
                <IonLabel position="stacked">Dia da semana</IonLabel>
                <IonSelect value={form.dayOfWeek} placeholder="Selecione" onIonChange={(event) => update('dayOfWeek', event.detail.value)} required>
                  <IonSelectOption value="1">Segunda-feira</IonSelectOption>
                  <IonSelectOption value="2">Terça-feira</IonSelectOption>
                  <IonSelectOption value="3">Quarta-feira</IonSelectOption>
                  <IonSelectOption value="4">Quinta-feira</IonSelectOption>
                  <IonSelectOption value="5">Sexta-feira</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Etapa de ensino</IonLabel>
                <IonSelect value={form.educationStage} placeholder="Selecione" onIonChange={(event) => update('educationStage', event.detail.value)} required>
                  <IonSelectOption value="Educação Infantil - Creche">Educação Infantil - Creche</IonSelectOption>
                  <IonSelectOption value="Educação Infantil - Pré-Escolar">Educação Infantil - Pré-Escolar</IonSelectOption>
                  <IonSelectOption value="Ensino Fundamental - Anos Iniciais">Ensino Fundamental - Anos Iniciais</IonSelectOption>
                  <IonSelectOption value="Ensino Fundamental - Anos Finais">Ensino Fundamental - Anos Finais</IonSelectOption>
                  <IonSelectOption value="EJA - Anos Iniciais">EJA - Anos Iniciais</IonSelectOption>
                  <IonSelectOption value="EJA - Anos Finais">EJA - Anos Finais</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Turno</IonLabel>
                <IonSelect value={form.shift} placeholder="Selecione" onIonChange={(event) => update('shift', event.detail.value)} required>
                  <IonSelectOption value="manha">Manhã</IonSelectOption>
                  <IonSelectOption value="tarde">Tarde</IonSelectOption>
                  <IonSelectOption value="noite">Noite</IonSelectOption>
                  <IonSelectOption value="integral">Integral</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Nutricionista (ID, opcional)</IonLabel>
                <IonInput type="number" min="1" value={form.nutritionistId} onIonInput={(event) => update('nutritionistId', event.detail.value)} />
              </IonItem>
            </div>
            <IonItem>
              <IonLabel position="stacked">Refeição</IonLabel>
              <IonInput value={form.meal} maxlength={80} placeholder="Ex.: Almoço" onIonInput={(event) => update('meal', event.detail.value)} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Nome do prato</IonLabel>
              <IonInput value={form.dish} maxlength={160} placeholder="Ex.: Arroz, feijão e frango" onIonInput={(event) => update('dish', event.detail.value)} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Ingredientes</IonLabel>
              <IonTextarea value={form.ingredients} maxlength={65535} autoGrow placeholder="Informe os ingredientes principais" onIonInput={(event) => update('ingredients', event.detail.value)} />
            </IonItem>
            <IonItem>
              <IonLabel>Cardápio ativo</IonLabel>
              <IonToggle checked={form.active} onIonChange={(event) => setForm((current) => ({ ...current, active: event.detail.checked }))} />
            </IonItem>
            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}
            <IonButton type="submit" expand="block" disabled={saving}>{saving ? 'Salvando...' : 'Cadastrar cardápio'}</IonButton>
          </form>
        </section>
  );
}

export default function MenuRegistration() {
  return (
    <IonPage>
      <Header />
      <IonContent>
        <MenuRegistrationForm />
      </IonContent>
      <Footer />
    </IonPage>
  );
}