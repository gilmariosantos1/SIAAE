import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';
type Dashboard = { totalEvaluations: number; overallAverage: number; activeSchools: number; activeMenus: number };
export default function AdminDashboard() { const [data, setData] = useState<Dashboard>(); useEffect(() => { fetch(`${API_URL}/api/admin/dashboard`).then((response) => response.json()).then((payload) => setData(payload.data)); }, []); return <IonPage><Header /><IonContent><main className="student-shell"><p className="eyebrow">VISÃO GERAL</p><h1>Alimentação escolar</h1>{data ? <div className="dashboard-grid">{[['Avaliações', data.totalEvaluations], ['Média geral', data.overallAverage], ['Escolas ativas', data.activeSchools], ['Cardápios ativos', data.activeMenus]].map(([label, value]) => <div className="metric" key={label as string}><span>{label}</span><strong>{value}</strong></div>)}</div> : <IonSpinner />}</main></IonContent><Footer /></IonPage>; }