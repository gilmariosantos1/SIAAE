const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

export type RatingKey = 'taste' | 'appearance' | 'temperature' | 'quantity';
export type Ratings = Record<RatingKey, number>;

export async function submitEvaluation(menuId: number, ratings: Ratings, suggestion: string) {
  const response = await fetch(`${API_URL}/api/student/evaluations`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ menuId, studentId: 1, ...ratings, suggestion: suggestion || undefined }),
  });
  const payload = await response.json() as { message?: string; data?: { average: number } };
  if (!response.ok) throw new Error(payload.message ?? 'Não foi possível enviar a avaliação.');
  return payload;
}

export async function submitFeedback(type: 'sugestao' | 'reclamacao' | 'elogio', message: string) {
  const response = await fetch(`${API_URL}/api/student/feedback`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, message, studentId: 1 }),
  });
  const payload = await response.json() as { message?: string };
  if (!response.ok) throw new Error(payload.message ?? 'Não foi possível enviar sua mensagem.');
}
