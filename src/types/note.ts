export interface Note {
  id?: number;
  titulo: string;
  conteudo: string;
  favorita: boolean;
  cor?: string;
  dataCriacao?: string | Date;
  dataModificacao?: string | Date;
  dataLembrete?: string | null;
  qtdReagendamentos?: number;
  // Estados de UI (não persistem no backend)
  isCollapsed?: boolean;
  isDateEditing?: boolean;
}

export interface User {
  id: number;
  email: string;
  nome?: string;
  sobrenome?: string;
  telefone?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface NoteGroup {
  color: string;
  notes: Note[];
  isOpen: boolean;
  favCount: number;
}

export type NoteStatus = 'overdue' | 'urgent' | 'normal';
