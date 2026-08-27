export type Menu = {
  id: number;
  date: string;
  school: string;
  shift: string;
  meal: string;
  dish: string;
  ingredients: string | null;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

const today = () => new Date().toISOString().slice(0, 10);

export async function getTodayMenus(): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_URL}/api/menus?date=${today()}`);
    if (!response.ok) throw new Error('Falha ao carregar cardápio');
    const payload = (await response.json()) as { data: Menu[] };
    return payload.data;
  } catch {
    return [{
      id: 1,
      date: today(),
      school: 'EMEF Caminhos do Saber',
      shift: 'Manhã',
      meal: 'Almoço',
      dish: 'Arroz, feijão e frango assado',
      ingredients: 'Arroz, feijão, frango, salada e banana',
    }];
  }
}
