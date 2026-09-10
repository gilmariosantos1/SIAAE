export type Menu = {
  id: number;
  schoolId: number;
  date: string;
  school: string;
  educationStage: string;
  shift: string;
  meal: string;
  dish: string;
  ingredients: string[];
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

const today = () => new Date().toISOString().slice(0, 10);

export type School = { id: number; name: string };

export type CreateMenuInput = {
  schoolIds: number[];
  nutritionistId?: number;
  date: string;
  educationStage: string;
  shift: 'manha' | 'tarde' | 'noite' | 'integral';
  meal: string;
  dish: string;
  ingredients?: string[];
};

export async function getSchools(): Promise<School[]> {
  const response = await fetch(`${API_URL}/api/admin/schools`);
  if (!response.ok) throw new Error('Não foi possível carregar as escolas');
  const payload = (await response.json()) as { data: School[] };
  return payload.data;
}

export async function createMenu(input: CreateMenuInput): Promise<{ ids: number[] }> {
  const response = await fetch(`${API_URL}/api/menus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as { data?: { ids: number[] }; message?: string };
  if (!response.ok) throw new Error(payload.message ?? 'Não foi possível salvar o cardápio');
  return payload.data as { ids: number[] };
}

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
      schoolId: 1,
      date,
      school: 'EMEF Caminhos do Saber',
      educationStage: 'Ensino Fundamental - Anos Iniciais',
      shift: 'Manhã',
      meal: 'Almoço',
      dish: 'Arroz, feijão e frango assado',
      ingredients: ['Arroz', 'feijão', 'frango', 'salada', 'banana'],
    }];
  }
}

export type StudentClass = {
  id: number;
  name: string;
  educationStage: string;
  schoolId: number;
};

export async function getClasses(schoolId?: number): Promise<StudentClass[]> {
  const query = schoolId ? `?schoolId=${encodeURIComponent(schoolId)}` : '';
  const response = await fetch(`${API_URL}/api/student/classes${query}`);
  if (!response.ok) throw new Error('Não foi possível carregar as turmas');
  const payload = (await response.json()) as { data: StudentClass[] };
  return payload.data;
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
