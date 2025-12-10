import { Note } from '../types/note';
import { AlertCircle, CheckCircle, Calendar, Trash2 } from 'lucide-react';

interface UrgentModalProps {
  note: Note;
  onMarkAsDone: () => void;
  onSnooze: () => void;
  onDelete: () => void;
  onIgnore: () => void;
}

export default function UrgentModal({ note, onMarkAsDone, onSnooze, onDelete, onIgnore }: UrgentModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease] safe-area-top safe-area-bottom">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onIgnore} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-[slideUp_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-[bounce_1s_infinite]">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          Atenção Máxima!
        </h2>

        {/* Message */}
        <p className="text-gray-700 mb-2">
          A tarefa <strong className="text-gray-900">"{note.titulo}"</strong> venceu ou vence em instantes!
        </p>

        {/* Reagendamento warning */}
        {note.qtdReagendamentos && note.qtdReagendamentos > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-orange-800">
              ⚠️ Esta tarefa já foi reagendada <strong>{note.qtdReagendamentos}</strong> {note.qtdReagendamentos === 1 ? 'vez' : 'vezes'}!
            </p>
          </div>
        )}

        <p className="text-lg font-bold text-gray-800 mb-6">
          Qual a situação?
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onMarkAsDone}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Já Realizei</span>
          </button>

          <button
            onClick={onSnooze}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-6 h-6" />
            <span>Preciso Reagendar</span>
          </button>

          <button
            onClick={onDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
          >
            <Trash2 className="w-6 h-6" />
            <span>Excluir Nota</span>
          </button>
        </div>

        {/* Close link */}
        <button
          onClick={onIgnore}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm underline"
        >
          Fechar (Ignorar por enquanto)
        </button>
      </div>
    </div>
  );
}
