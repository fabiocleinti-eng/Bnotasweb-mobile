import { Note, NoteStatus } from '../types/note';

/**
 * Calcula o status de uma nota baseado na dataLembrete
 */
export function getNoteStatus(note: Note): NoteStatus {
  if (!note.dataLembrete) return 'normal';

  const now = new Date().getTime();
  const reminderDate = new Date(note.dataLembrete).getTime();
  const diffMinutes = (reminderDate - now) / 1000 / 60;

  if (diffMinutes < 0) return 'overdue'; // Vencido
  if (diffMinutes < 10) return 'urgent'; // Urgente (menos de 10 minutos)
  return 'normal';
}

/**
 * Formata data para input datetime-local
 */
export function formatDateForInput(date: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

/**
 * Formata data para exibição (dd/MM HH:mm)
 */
export function formatDateDisplay(date: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`;
}

/**
 * Formata data simples (dd/MM/yyyy)
 */
export function formatDateSimple(date: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Cores disponíveis para as notas (Post-its)
 */
export const AVAILABLE_COLORS = [
  '#fff9c4', // Amarelo
  '#ffcdd2', // Vermelho
  '#f8bbd0', // Rosa
  '#e1bee7', // Roxo
  '#d1c4e9', // Índigo
  '#c5cae9', // Azul
  '#bbdefb', // Azul Claro
  '#b3e5fc', // Ciano
  '#b2dfdb', // Teal
  '#c8e6c9', // Verde
  '#f0f4c3', // Lima
  '#ffe0b2', // Laranja
  '#f5f5f5'  // Cinza
];

/**
 * Valida força da senha
 */
export function validatePassword(password: string) {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
}

/**
 * Calcula força da senha (0-100)
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  const criteria = validatePassword(password);
  const count = Object.values(criteria).filter(Boolean).length;

  if (password.length === 0) {
    return { score: 0, label: '', color: '#e0e0e0' };
  }

  if (count <= 1) {
    return { score: 33, label: 'Fraca', color: '#ff5252' };
  }

  if (count === 2) {
    return { score: 66, label: 'Média', color: '#ffc107' };
  }

  return { score: 100, label: 'Forte', color: '#28a745' };
}
