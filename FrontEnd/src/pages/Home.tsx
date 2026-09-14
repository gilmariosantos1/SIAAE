import { useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonPage, IonSelect, IonSelectOption, IonSpinner } from '@ionic/react';
import { calendarOutline, chatbubbleEllipsesOutline, checkmarkCircleOutline, chevronForward, layersOutline, peopleOutline, restaurantOutline, schoolOutline } from 'ionicons/icons';
import { getClasses, getSchools, getTodayMenus, Menu, School, StudentClass } from '../services/menuService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../theme/Home.css';

const Home: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<number>();
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [classesLoading, setClassesLoading] = useState(false);
  const [classesError, setClassesError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSchools(), getTodayMenus()]).then(([availableSchools, todayMenus]) => {
      setSchools(availableSchools);
      setMenus(todayMenus);
      const firstSchoolId = String(todayMenus[0]?.schoolId ?? availableSchools[0]?.id ?? '');
      setSelectedSchoolId(firstSchoolId);
      setSelectedMenuId(todayMenus.find((menu) => String(menu.schoolId) === firstSchoolId)?.id);
    }).finally(() => setLoading(false));
  }, []);

  const schoolMenus = menus.filter((menu) => String(menu.schoolId) === selectedSchoolId);
  const selectedMenu = schoolMenus.find((menu) => menu.id === selectedMenuId) ?? schoolMenus[0];
  const ingredients = selectedMenu?.ingredients ?? [];

  useEffect(() => {
    setSelectedStage('');
    setSelectedClassId('');
    setSelectedIngredients([]);
    if (!selectedSchoolId) return;
    setClassesLoading(true);
    setClassesError('');
    getClasses(Number(selectedSchoolId)).then((availableClasses) => {
      setClasses(availableClasses);
      if (!availableClasses.length) setClassesError('Nenhuma turma cadastrada para esta escola.');
    }).catch(() => {
      setClasses([]);
      setClassesError('Não foi possível carregar as turmas desta escola.');
    }).finally(() => setClassesLoading(false));
  }, [selectedSchoolId]);

  useEffect(() => {
    if (!selectedMenu) return;
    setSelectedIngredients([]);
  }, [selectedMenuId, selectedMenu]);

  const stages = [...new Set(classes.map((studentClass) => studentClass.educationStage))];
  const stageClasses = classes.filter((studentClass) => studentClass.educationStage === selectedStage);
  const canEvaluate = Boolean(selectedClassId && selectedStage && selectedIngredients.length);

  useEffect(() => {
    setSelectedClassId('');
  }, [selectedStage]);

  const evaluationLink = selectedMenu
    ? `/avaliar/${selectedMenu.id}?schoolId=${selectedMenu.schoolId}&ingredients=${encodeURIComponent(selectedIngredients.join('|'))}&classId=${selectedClassId}&educationStage=${encodeURIComponent(selectedStage)}`
    : '/avaliar/0';

  function selectSchool(value: string | number | null | undefined) {
    const schoolId = value == null ? '' : String(value);
    setSelectedSchoolId(schoolId);
    setSelectedMenuId(menus.find((menu) => String(menu.schoolId) === schoolId)?.id);
  }

  function selectMenu(menuId: number) {
    setSelectedMenuId(menuId);
    setSelectedIngredients([]);
  }

  return (
    <IonPage>
      <Header />
      <IonContent>
        <main className="home-shell">
          <section className="welcome-block">
            <div className="welcome-kicker"><IonIcon icon={restaurantOutline} /> <span>Cardápio de hoje</span></div>
            <h1>Conte como foi a refeição.</h1>
            <p className="intro">Escolha a escola, identifique a turma e registre o que realmente foi servido.</p>
          </section>

          <section className="menu-list" aria-label="Cardápio do dia">
            {loading ? <div className="loading"><IonSpinner name="crescent" /> Carregando cardápio...</div> : (
              <>
                <div className="selection-panel">
                  <div className="section-heading">
                    <span className="section-icon"><IonIcon icon={schoolOutline} /></span>
                    <div><p className="section-step">01</p><h2>Identifique o local</h2></div>
                  </div>
                  <label className="select-label" htmlFor="school-select">Escola</label>
                  <IonSelect id="school-select" value={selectedSchoolId} placeholder="Selecione a escola" onIonChange={(event) => selectSchool(event.detail.value)} interface="popover">
                    {schools.map((school) => <IonSelectOption key={school.id} value={String(school.id)}>{school.name}</IonSelectOption>)}
                  </IonSelect>
                </div>
                {selectedMenu ? <article className="menu-card" key={selectedMenu.id}>
                  <div className="menu-card-top">
                    <div>
                      <p className="card-kicker"><IonIcon icon={calendarOutline} /> Refeição de hoje</p>
                      <label className="select-label" htmlFor="meal-select">Tipo de refeição</label>
                      <IonSelect id="meal-select" value={selectedMenu.id} onIonChange={(event) => selectMenu(Number(event.detail.value))} interface="popover">
                        {schoolMenus.map((menu) => <IonSelectOption key={menu.id} value={menu.id}>{menu.meal}</IonSelectOption>)}
                      </IonSelect>
                      <h2>{selectedMenu.dish}</h2>
                    </div>
                    <div className="date-badge"><IonIcon icon={calendarOutline} /><span>{selectedMenu.shift}</span></div>
                  </div>
                  <div className="served-section">
                    <div className="section-heading compact">
                      <span className="section-icon"><IonIcon icon={layersOutline} /></span>
                      <div><p className="section-step">02</p><h2>O que foi servido?</h2></div>
                    </div>
                    <p className="field-hint">Marque todos os ingredientes usados no preparo de hoje.</p>
                    <IonSelect id="ingredient-select" multiple value={selectedIngredients} placeholder="Selecione os ingredientes" onIonChange={(event) => setSelectedIngredients(event.detail.value)} interface="popover">
                      {ingredients.map((ingredient) => <IonSelectOption key={ingredient} value={ingredient}>{ingredient}</IonSelectOption>)}
                    </IonSelect>
                    <div className="ingredient-chips" aria-live="polite">
                      {selectedIngredients.length ? selectedIngredients.map((ingredient) => <span className="ingredient-chip" key={ingredient}><IonIcon icon={checkmarkCircleOutline} />{ingredient}</span>) : <span className="empty-selection">Nenhum ingrediente selecionado</span>}
                    </div>
                  </div>
                  <div className="context-section">
                    <div className="section-heading compact">
                      <span className="section-icon"><IonIcon icon={peopleOutline} /></span>
                      <div><p className="section-step">03</p><h2>Quem está avaliando?</h2></div>
                    </div>
                    <div className="evaluation-context">
                      <div><label className="select-label" htmlFor="stage-select">Etapa de ensino</label><IonSelect id="stage-select" value={selectedStage} placeholder={classesLoading ? 'Carregando etapas...' : 'Selecione a etapa'} disabled={classesLoading || Boolean(classesError)} onIonChange={(event) => setSelectedStage(event.detail.value)} interface="popover">
                        {stages.map((stage) => <IonSelectOption key={stage} value={stage}>{stage}</IonSelectOption>)}
                      </IonSelect></div>
                      <div><label className="select-label" htmlFor="class-select">Turma</label><IonSelect id="class-select" value={selectedClassId} placeholder={classesLoading ? 'Carregando turmas...' : 'Selecione a turma'} disabled={classesLoading || !selectedStage || Boolean(classesError)} onIonChange={(event) => setSelectedClassId(event.detail.value)} interface="popover">
                        {stageClasses.map((studentClass) => <IonSelectOption key={studentClass.id} value={String(studentClass.id)}>{studentClass.name}</IonSelectOption>)}
                      </IonSelect></div>
                    </div>
                    {classesError && <p className="field-error" role="alert">{classesError}</p>}
                  </div>
                  <div className="menu-action">
                    <div><span className="action-status"><IonIcon icon={checkmarkCircleOutline} /> {canEvaluate ? 'Dados prontos para avaliação' : 'Complete os dados acima'}</span><p>{canEvaluate ? 'Você poderá registrar sua opinião na próxima etapa.' : 'Selecione os ingredientes, a etapa e a turma.'}</p></div>
                    <IonButton expand="block" className="evaluate-button" routerLink={evaluationLink} disabled={!canEvaluate}>
                      Avaliar refeição <IonIcon slot="end" icon={chevronForward} />
                    </IonButton>
                  </div>
                </article> : <p className="empty-state">Não há cardápio cadastrado para esta escola hoje.</p>}
              </>
            )}
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
