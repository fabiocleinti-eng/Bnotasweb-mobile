import API_URL from '../config/api';
import { Note } from '../types/note';
import { authService } from './authService';

export const noteService = {
  // Get Notes
  async getNotes(): Promise<Note[]> {
    const token = authService.getToken();
    
    const response = await fetch(`${API_URL}/anotacoes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar notas');
    }

    return response.json();
  },

  // Create Note
  async createNote(note: {
    titulo: string;
    conteudo: string;
    favorita: boolean;
    cor?: string;
    dataLembrete?: string | null;
  }): Promise<Note> {
    const token = authService.getToken();
    
    const response = await fetch(`${API_URL}/anotacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(note)
    });

    if (!response.ok) {
      throw new Error('Erro ao criar nota');
    }

    return response.json();
  },

  // Update Note
  async updateNote(id: number, note: Partial<Note>): Promise<Note> {
    const token = authService.getToken();
    
    const response = await fetch(`${API_URL}/anotacoes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(note)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar nota');
    }

    return response.json();
  },

  // Delete Note
  async deleteNote(id: number): Promise<void> {
    const token = authService.getToken();
    
    const response = await fetch(`${API_URL}/anotacoes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir nota');
    }
  }
};
