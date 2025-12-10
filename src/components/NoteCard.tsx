import { Star, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { Note } from '../types/note';
import { getNoteStatus, formatDateDisplay } from '../utils/noteHelpers';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export default function NoteCard({ note, onClick, onDelete, onToggleFavorite }: NoteCardProps) {
  const status = getNoteStatus(note);

  const getCardClasses = () => {
    const base = 'rounded-2xl p-4 shadow-md transition-all active:scale-95 relative';
    
    if (status === 'overdue') {
      return `${base} opacity-80 grayscale-[0.3] border-l-4 border-gray-600`;
    }
    
    if (status === 'urgent') {
      return `${base} urgent-pulse border-l-4 border-red-500`;
    }
    
    return `${base} border border-gray-200`;
  };

  // Strip HTML tags for preview
  const getTextPreview = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div
      onClick={onClick}
      className={getCardClasses()}
      style={{ backgroundColor: note.cor || '#fff9c4' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex-1 min-w-0">
          {/* Status Indicators */}
          <div className="flex items-center gap-2 mb-1">
            {status === 'overdue' && (
              <div className="w-2 h-2 rounded-full bg-gray-600" title="Vencido" />
            )}
            {status === 'urgent' && (
              <div className="w-2 h-2 rounded-full bg-red-500 blink-dot" title="Urgente" />
            )}
            {note.qtdReagendamentos && note.qtdReagendamentos > 0 && (
              <AlertTriangle 
                className="w-4 h-4 text-red-600" 
                title={`Reagendada ${note.qtdReagendamentos} vezes`}
              />
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-base line-clamp-2 ${status === 'overdue' ? 'line-through opacity-70' : ''}`}>
            {note.titulo || 'Sem título'}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {note.favorita && (
            <Star className="w-5 h-5 text-orange-500 fill-current flex-shrink-0" />
          )}
          {note.dataLembrete && (
            <Clock 
              className={`w-4 h-4 flex-shrink-0 ${status === 'urgent' ? 'text-red-600' : status === 'overdue' ? 'text-gray-600' : 'text-gray-500'}`}
            />
          )}
        </div>
      </div>

      {/* Content Preview */}
      <p className={`text-sm text-gray-700 line-clamp-2 mb-2 ${status === 'overdue' ? 'opacity-60' : ''}`}>
        {getTextPreview(note.conteudo) || 'Sem conteúdo'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        {note.dataLembrete && (
          <span className={`font-medium ${status === 'urgent' ? 'text-red-600 font-bold' : ''}`}>
            {formatDateDisplay(note.dataLembrete)}
          </span>
        )}
        <div className="flex-1" />
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className="touch-target p-1 hover:bg-black/5 rounded-full transition-colors"
            title={note.favorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star className={`w-5 h-5 ${note.favorita ? 'text-orange-500 fill-current' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={onDelete}
            className="touch-target p-1 hover:bg-black/5 rounded-full transition-colors"
            title="Excluir nota"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
