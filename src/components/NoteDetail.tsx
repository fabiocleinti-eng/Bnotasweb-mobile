import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Save, Clock, AlertTriangle } from 'lucide-react';
import { Note } from '../types/note';
import { noteService } from '../services/noteService';
import { AVAILABLE_COLORS, formatDateForInput } from '../utils/noteHelpers';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [note, setNote] = useState<Note>({
    titulo: '',
    conteudo: '',
    favorita: false,
    cor: '#fff9c4',
    dataLembrete: null,
    qtdReagendamentos: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load note if editing
  useEffect(() => {
    if (id && id !== 'new') {
      loadNote(Number(id));
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadNote = async (noteId: number) => {
    try {
      const notes = await noteService.getNotes();
      const found = notes.find(n => n.id === noteId);
      
      if (found) {
        setNote({
          ...found,
          cor: found.cor || '#fff9c4',
          qtdReagendamentos: found.qtdReagendamentos || 0
        });
      } else {
        alert('Nota não encontrada');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao carregar nota:', error);
      alert('Erro ao carregar nota');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note.titulo.trim()) {
      alert('Título é obrigatório!');
      return;
    }

    setSaving(true);

    try {
      let dataFormatada = null;
      if (note.dataLembrete) {
        dataFormatada = new Date(note.dataLembrete).toISOString();
      }

      const noteToSend = {
        ...note,
        dataLembrete: dataFormatada
      };

      if (note.id) {
        // Update
        await noteService.updateNote(note.id, noteToSend);
      } else {
        // Create
        await noteService.createNote(noteToSend);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar nota');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note.id) {
      navigate('/dashboard');
      return;
    }

    if (confirm(`Excluir "${note.titulo}"?`)) {
      try {
        await noteService.deleteNote(note.id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir nota');
      }
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setNote(prev => ({ ...prev, conteudo: contentRef.current!.innerHTML }));
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col safe-area-top safe-area-bottom" style={{ backgroundColor: note.cor }}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-black/10">
        <button
          onClick={() => navigate('/dashboard')}
          className="touch-target p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          {/* Reagendamento indicator */}
          {note.qtdReagendamentos && note.qtdReagendamentos > 0 && (
            <div
              className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold"
              title={`Esta tarefa foi reagendada ${note.qtdReagendamentos} vezes`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{note.qtdReagendamentos}x</span>
            </div>
          )}

          <button
            onClick={() => setNote(prev => ({ ...prev, favorita: !prev.favorita }))}
            className="touch-target p-2 hover:bg-black/5 rounded-full transition-colors"
            title={note.favorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star className={`w-6 h-6 ${note.favorita ? 'text-orange-500 fill-current' : 'text-gray-600'}`} />
          </button>

          <button
            onClick={handleDelete}
            className="touch-target p-2 hover:bg-black/5 rounded-full transition-colors"
            title="Excluir nota"
          >
            <Trash2 className="w-6 h-6 text-red-500" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title */}
        <input
          type="text"
          value={note.titulo}
          onChange={(e) => setNote(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Título da nota"
          className="w-full bg-transparent border-none outline-none text-2xl font-bold placeholder-gray-400"
        />

        {/* Reminder */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              note.dataLembrete 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'bg-black/5 text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {note.dataLembrete ? 'Lembrete Definido' : 'Definir Lembrete'}
            </span>
          </button>

          {note.dataLembrete && (
            <button
              onClick={() => setNote(prev => ({ ...prev, dataLembrete: null }))}
              className="text-xs text-red-600 underline"
            >
              Remover
            </button>
          )}
        </div>

        {showDatePicker && (
          <input
            type="datetime-local"
            value={formatDateForInput(note.dataLembrete)}
            onChange={(e) => setNote(prev => ({ ...prev, dataLembrete: e.target.value || null }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none"
          />
        )}

        {/* Toolbar */}
        <div className="flex gap-2 flex-wrap bg-white/60 p-2 rounded-xl">
          <button
            onClick={() => formatText('bold')}
            className="touch-target px-3 py-2 bg-white rounded-lg font-bold hover:bg-gray-100 transition-colors"
            title="Negrito"
          >
            B
          </button>
          <button
            onClick={() => formatText('italic')}
            className="touch-target px-3 py-2 bg-white rounded-lg italic hover:bg-gray-100 transition-colors"
            title="Itálico"
          >
            I
          </button>
          <button
            onClick={() => formatText('underline')}
            className="touch-target px-3 py-2 bg-white rounded-lg underline hover:bg-gray-100 transition-colors"
            title="Sublinhado"
          >
            U
          </button>
          <label className="touch-target px-3 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1">
            <span className="text-red-500 font-bold">A</span>
            <input
              type="color"
              onChange={(e) => formatText('foreColor', e.target.value)}
              className="w-0 h-0 opacity-0"
            />
          </label>
        </div>

        {/* Content Editor */}
        <div
          ref={contentRef}
          contentEditable
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: note.conteudo }}
          className="min-h-[200px] p-4 bg-white/40 rounded-xl outline-none focus:bg-white/60 transition-colors"
          placeholder="Escreva aqui..."
        />

        {/* Color Picker */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Cor da Nota:</p>
          <div className="flex gap-3 flex-wrap">
            {AVAILABLE_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setNote(prev => ({ ...prev, cor: color }))}
                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                  note.cor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title="Mudar cor"
              />
            ))}
          </div>
        </div>

        {/* Creation Date */}
        {note.dataCriacao && (
          <p className="text-xs text-gray-600 italic text-right">
            Criado em: {new Date(note.dataCriacao).toLocaleDateString('pt-BR')}
          </p>
        )}
      </main>

      {/* Footer - Save Button */}
      <footer className="p-4 border-t border-black/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Salvando...' : 'Salvar Nota'}</span>
        </button>
      </footer>
    </div>
  );
}
