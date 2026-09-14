import { useEffect, useState } from "react";
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import { alertCircleOutline, arrowForward, barChartOutline, calendarOutline, schoolOutline, restaurantOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../theme/AdminDashboard.css";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";
type Dashboard = {
  totalEvaluations: number;
  overallAverage: number;
  activeSchools: number;
  activeMenus: number;
  acceptability: number;
  approval: number;
  rejection: number;
  schoolAcceptance: { name: string; average: number; evaluations: number }[];
  menuAcceptance: { dish: string; meal: string; average: number; evaluations: number }[];
  evaluationsByPeriod: { date: string; evaluations: number }[];
  lowestMenus: { dish: string; meal: string; average: number; evaluations: number }[];
};
export default function AdminDashboard() {
  const [data, setData] = useState<Dashboard>();
  const [error, setError] = useState("");
  const history = useHistory();
  useEffect(() => {
    fetch(`${API_URL}/api/admin/dashboard`)
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar o dashboard.");
        return response.json();
      })
      .then((payload) => {
        const dashboard = payload.data as Partial<Dashboard>;
        const overallAverage = Number(dashboard.overallAverage ?? 0);
        setData({
          totalEvaluations: Number(dashboard.totalEvaluations ?? 0),
          overallAverage,
          activeSchools: Number(dashboard.activeSchools ?? 0),
          activeMenus: Number(dashboard.activeMenus ?? 0),
          acceptability: Number(dashboard.acceptability ?? overallAverage / 5 * 100),
          approval: Number(dashboard.approval ?? 0),
          rejection: Number(dashboard.rejection ?? 0),
          schoolAcceptance: dashboard.schoolAcceptance ?? [],
          menuAcceptance: dashboard.menuAcceptance ?? [],
          evaluationsByPeriod: dashboard.evaluationsByPeriod ?? [],
          lowestMenus: dashboard.lowestMenus ?? [],
        });
      })
      .catch(() => setError("Não foi possível carregar os indicadores agora."));
  }, []);
  const metrics = data ? [
    { label: "Avaliações", value: data.totalEvaluations.toLocaleString("pt-BR"), icon: barChartOutline, tone: "green" },
    { label: "Média geral", value: `${Number(data.overallAverage).toFixed(2)} / 5`, icon: restaurantOutline, tone: "yellow" },
    { label: "Escolas ativas", value: data.activeSchools.toLocaleString("pt-BR"), icon: schoolOutline, tone: "blue" },
    { label: "Cardápios ativos", value: data.activeMenus.toLocaleString("pt-BR"), icon: calendarOutline, tone: "orange" },
  ] : [];
  const maxPeriodValue = Math.max(...(data?.evaluationsByPeriod.map((item) => item.evaluations) ?? [1]), 1);
  return (
    <IonPage>
      <Header />
      <IonContent>
        <main className="dashboard-shell">
          <div className="dashboard-heading">
            <div>
              <p className="eyebrow">PAINEL ADMINISTRATIVO</p>
              <h1>Alimentação escolar</h1>
              <p className="dashboard-intro">Acompanhe a percepção dos estudantes e encontre rapidamente os pontos que precisam de atenção.</p>
            </div>
            <div className="dashboard-actions">
              <IonButton className="dashboard-action secondary" fill="outline" onClick={() => history.push("/admin/cardapios")}>
                Cadastrar cardápio <IonIcon slot="end" icon={arrowForward} />
              </IonButton>
              <IonButton className="dashboard-action" onClick={() => history.push("/avaliar")}>
                Acessar avaliação <IonIcon slot="end" icon={arrowForward} />
              </IonButton>
            </div>
          </div>
          {error && <p className="dashboard-error" role="alert">{error}</p>}
          {!data && !error ? <div className="dashboard-loading"><IonSpinner /> Carregando indicadores...</div> : data && <>
            <section className="dashboard-metrics" aria-label="Indicadores principais">
              {metrics.map((metric) => <article className={`dashboard-metric ${metric.tone}`} key={metric.label}>
                <span className="metric-icon"><IonIcon icon={metric.icon} /></span>
                <span className="metric-label">{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>)}
            </section>
            <section className="dashboard-summary" aria-label="Índices de avaliação">
              <div><span>Índice de aceitabilidade</span><strong>{Number(data.acceptability).toFixed(1)}%</strong></div>
              <div><span>Percentual de aprovação</span><strong className="positive">{Number(data.approval).toFixed(1)}%</strong></div>
              <div><span>Percentual de rejeição</span><strong className="negative">{Number(data.rejection).toFixed(1)}%</strong></div>
            </section>
            <section className="dashboard-panels">
              <article className="dashboard-panel school-panel">
                <div className="panel-heading"><div><p className="panel-kicker">DESEMPENHO</p><h2>Aceitabilidade por escola</h2></div><span className="panel-symbol"><IonIcon icon={schoolOutline} /></span></div>
                {data.schoolAcceptance.length ? <div className="ranking-list">{data.schoolAcceptance.map((school) => <div className="ranking-row" key={school.name}><div className="ranking-label"><strong>{school.name}</strong><small>{school.evaluations} avaliações</small></div><div className="ranking-track"><span style={{ width: `${Math.min(Number(school.average) / 5 * 100, 100)}%` }} /></div><b>{Number(school.average).toFixed(2)}</b></div>)}</div> : <p className="panel-empty">Ainda não há avaliações por escola.</p>}
              </article>
              <article className="dashboard-panel period-panel">
                <div className="panel-heading"><div><p className="panel-kicker">ÚLTIMOS 7 DIAS</p><h2>Volume de avaliações</h2></div><span className="panel-symbol"><IonIcon icon={barChartOutline} /></span></div>
                {data.evaluationsByPeriod.length ? <div className="period-chart" aria-label="Avaliações por dia">{data.evaluationsByPeriod.map((item) => <div className="period-column" key={item.date}><span className="period-value">{item.evaluations}</span><div className="period-bar"><i style={{ height: `${item.evaluations / maxPeriodValue * 100}%` }} /></div><small>{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(`${item.date}T12:00:00`))}</small></div>)}</div> : <p className="panel-empty">Ainda não há avaliações no período.</p>}
              </article>
              <article className="dashboard-panel menu-panel">
                <div className="panel-heading"><div><p className="panel-kicker">CARDÁPIOS</p><h2>Aceitabilidade por prato</h2></div><span className="panel-symbol"><IonIcon icon={restaurantOutline} /></span></div>
                {data.menuAcceptance.length ? <div className="ranking-list">{data.menuAcceptance.slice(0, 5).map((menu) => <div className="ranking-row" key={`${menu.dish}-${menu.meal}`}><div className="ranking-label"><strong>{menu.dish}</strong><small>{menu.meal} · {menu.evaluations} avaliações</small></div><div className="ranking-track"><span style={{ width: `${Math.min(Number(menu.average) / 5 * 100, 100)}%` }} /></div><b>{Number(menu.average).toFixed(2)}</b></div>)}</div> : <p className="panel-empty">Ainda não há avaliações por cardápio.</p>}
              </article>
              <article className="dashboard-panel alert-panel">
                <div className="panel-heading"><div><p className="panel-kicker">ATENÇÃO NUTRICIONAL</p><h2>Menor aprovação</h2></div><span className="panel-symbol warning"><IonIcon icon={alertCircleOutline} /></span></div>
                {data.lowestMenus.length ? <div className="alert-list">{data.lowestMenus.map((menu) => <div className="alert-row" key={`${menu.dish}-${menu.meal}`}><div><strong>{menu.dish}</strong><small>{menu.meal} · {menu.evaluations} avaliações</small></div><b>{Number(menu.average).toFixed(2)} / 5</b></div>)}</div> : <p className="panel-empty">Nenhum alerta nutricional no momento.</p>}
              </article>
            </section>
          </>}
        </main>
      </IonContent>
      <Footer />
    </IonPage>
  );
}
