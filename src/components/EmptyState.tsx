import { StickyNote, AlertCircle, Star } from 'lucide-react';

interface EmptyStateProps {
  type: 'all' | 'urgent' | 'favorites' | 'search';
  searchTerm?: string;
  onCreateNote?: () => void;
}

export default function EmptyState({ type, searchTerm, onCreateNote }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: <StickyNote className="w-16 h-16 text-gray-400" />,
          title: 'Nenhuma nota encontrada',
          description: `Não encontramos notas com "${searchTerm}"`,
          showButton: false
        };
      
      case 'urgent':
        return {
          icon: <AlertCircle className="w-16 h-16 text-gray-400" />,
          title: 'Nenhuma nota urgente',
          description: 'Você não tem tarefas vencidas ou com prazo próximo. Parabéns! 🎉',
          showButton: false
        };
      
      case 'favorites':
        return {
          icon: <Star className="w-16 h-16 text-gray-400" />,
          title: 'Nenhuma nota favorita',
          description: 'Marque suas notas importantes com estrela ⭐',
          showButton: false
        };
      
      default:
        return {
          icon: <div className="text-7xl mb-4">📝</div>,
          title: 'Nenhuma nota criada',
          description: 'Comece criando sua primeira nota!',
          showButton: true
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      {content.icon}
      <h2 className="text-xl font-bold text-gray-700 mt-6 mb-2">
        {content.title}
      </h2>
      <p className="text-gray-500 mb-8">
        {content.description}
      </p>
      {content.showButton && onCreateNote && (
        <button
          onClick={onCreateNote}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Criar Primeira Nota
        </button>
      )}
    </div>
  );
}
