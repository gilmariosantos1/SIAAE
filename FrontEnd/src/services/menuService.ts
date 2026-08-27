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
  return getMenusByDate(today());
}

export async function getMenusByDate(date: string): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_URL}/api/menus?date=${date}`);
    if (!response.ok) throw new Error('Falha ao carregar cardápio');
    const payload = (await response.json()) as { data: Menu[] };
    return payload.data;
  } catch {
    return [{
      id: 1,
      date,
      school: 'EMEF Caminhos do Saber',
      shift: 'Manhã',
      meal: 'Almoço',
      dish: 'Arroz, feijão e frango assado',
      ingredients: 'Arroz, feijão, frango, salada e banana',
    }];
  }
}

export async function getWeekMenus(): Promise<Menu[]> {
  const start = new Date();
  const menus = await Promise.all(Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return getMenusByDate(date.toISOString().slice(0, 10));
  }));
  return menus.flat();
}
