import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LogOut, RefreshCw } from 'lucide-react';
import { Note } from '../types/note';
import { noteService } from '../services/noteService';
import { authService } from '../services/authService';
import { getNoteStatus } from '../utils/noteHelpers';
import NoteCard from './NoteCard';
import BottomTabs from './BottomTabs';
import UrgentModal from './UrgentModal';
import EmptyState from './EmptyState';

type TabType = 'all' | 'urgent' | 'favorites';

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('Usuário');
  
  // Modal de cobrança
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [criticalNote, setCriticalNote] = useState<Note | null>(null);
  const [snoozedIds, setSnoozedIds] = useState<Set<number>>(new Set());

  // Load user name
  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      if ((user as any).nome) {
        setUserName((user as any).nome);
      } else if (user.email) {
        const namePart = user.email.split('@')[0];
        setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
      }
    }
  }, []);

  // Load notes
  const loadNotes = async () => {
    try {
      const data = await noteService.getNotes();
      setNotes(data.map(n => ({
        ...n,
        cor: n.cor || '#fff9c4',
        qtdReagendamentos: n.qtdReagendamentos || 0
      })));
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotes();

    // Polling a cada 5 minutos
    const interval = setInterval(() => {
      loadNotes();
      checkCriticalTasks();
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  // Check critical tasks
  const checkCriticalTasks = () => {
    const now = new Date().getTime();
    
    const critical = notes.find(n => {
      if (!n.dataLembrete || !n.id) return false;
      if (snoozedIds.has(n.id)) return false;

      const reminderDate = new Date(n.dataLembrete).getTime();
      const diffMinutes = (reminderDate - now) / 1000 / 60;
      
      return diffMinutes < 10; // Vencido ou falta menos de 10 minutos
    });

    if (critical && !showUrgentModal) {
      setCriticalNote(critical);
      setShowUrgentModal(true);
    }
  };

  useEffect(() => {
    checkCriticalTasks();
  }, [notes]);

  // Filter notes
  useEffect(() => {
    let filtered = [...notes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tab filter
    if (activeTab === 'urgent') {
      filtered = filtered.filter(n => {
        const status = getNoteStatus(n);
        return status === 'urgent' || status === 'overdue';
      });
    } else if (activeTab === 'favorites') {
      filtered = filtered.filter(n => n.favorita);
    }

    // Sort: overdue → urgent → normal
    filtered.sort((a, b) => {
      const statusA = getNoteStatus(a);
      const statusB = getNoteStatus(b);
      
      const priority = { overdue: 0, urgent: 1, normal: 2 };
      
      if (priority[statusA] !== priority[statusB]) {
        return priority[statusA] - priority[statusB];
      }
      
      // Se mesma prioridade, mais recente primeiro
      return new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime();
    });

    setFilteredNotes(filtered);
  }, [notes, activeTab, searchTerm]);

  // Counts
  const urgentCount = notes.filter(n => {
    const status = getNoteStatus(n);
    return status === 'urgent' || status === 'overdue';
  }).length;

  const favoritesCount = notes.filter(n => n.favorita).length;

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
  };

  const handleLogout = () => {
    if (confirm('Deseja sair?')) {
      authService.logout();
      navigate('/login');
    }
  };

  const handleCreateNote = () => {
    navigate('/note/new');
  };

  const handleOpenNote = (note: Note) => {
    navigate(`/note/${note.id}`);
  };

  const handleDeleteNote = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    
    if (!note.id) return;
    
    if (confirm(`Excluir "${note.titulo}"?`)) {
      try {
        await noteService.deleteNote(note.id);
        setNotes(prev => prev.filter(n => n.id !== note.id));
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir nota');
      }
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    
    if (!note.id) return;
    
    try {
      const updated = await noteService.updateNote(note.id, {
        favorita: !note.favorita
      });
      
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, favorita: updated.favorita } : n));
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  };

  // Modal handlers
  const handleMarkAsDone = async () => {
    if (!criticalNote || !criticalNote.id) return;
    
    try {
      await noteService.updateNote(criticalNote.id, {
        dataLembrete: null,
        qtdReagendamentos: 0
      });
      
      setShowUrgentModal(false);
      setCriticalNote(null);
      await loadNotes();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSnooze = () => {
    if (criticalNote && criticalNote.id) {
      setSnoozedIds(prev => new Set(prev).add(criticalNote.id!));
      setShowUrgentModal(false);
      navigate(`/note/${criticalNote.id}`);
    }
  };

  const handleDeleteCritical = async () => {
    if (!criticalNote || !criticalNote.id) return;
    
    if (confirm('Tem certeza que deseja EXCLUIR esta nota?')) {
      try {
        await noteService.deleteNote(criticalNote.id);
        setShowUrgentModal(false);
        setCriticalNote(null);
        await loadNotes();
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleIgnore = () => {
    if (criticalNote && criticalNote.id) {
      setSnoozedIds(prev => new Set(prev).add(criticalNote.id!));
    }
    setShowUrgentModal(false);
  };

  // Group notes by status for "all" tab
  const overdueNotes = filteredNotes.filter(n => getNoteStatus(n) === 'overdue');
  const urgentNotes = filteredNotes.filter(n => getNoteStatus(n) === 'urgent');
  const normalNotes = filteredNotes.filter(n => getNoteStatus(n) === 'normal');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Olá, {userName}! 👋</h1>
              <p className="text-sm text-gray-500">{notes.length} notas criadas</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="touch-target p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Atualizar"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="touch-target p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar notas..."
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Carregando notas...</p>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <EmptyState
            type={searchTerm ? 'search' : activeTab}
            searchTerm={searchTerm}
            onCreateNote={handleCreateNote}
          />
        ) : (
          <div className="py-4 space-y-6">
            {/* Vencidos */}
            {activeTab === 'all' && overdueNotes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600" />
                  <h2 className="font-bold text-gray-700">Vencidos ({overdueNotes.length})</h2>
                </div>
                <div className="space-y-3">
                  {overdueNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onClick={() => handleOpenNote(note)}
                      onDelete={(e) => handleDeleteNote(e, note)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, note)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Urgentes */}
            {activeTab === 'all' && urgentNotes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 blink-dot" />
                  <h2 className="font-bold text-red-600">Urgentes ({urgentNotes.length})</h2>
                </div>
                <div className="space-y-3">
                  {urgentNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onClick={() => handleOpenNote(note)}
                      onDelete={(e) => handleDeleteNote(e, note)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, note)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Normais / Todas as filtradas */}
            {activeTab === 'all' && normalNotes.length > 0 && (
              <section>
                <h2 className="font-bold text-gray-700 mb-3 px-2">Outras ({normalNotes.length})</h2>
                <div className="space-y-3">
                  {normalNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onClick={() => handleOpenNote(note)}
                      onDelete={(e) => handleDeleteNote(e, note)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, note)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Tabs Urgente e Favoritas mostram tudo junto */}
            {activeTab !== 'all' && (
              <div className="space-y-3">
                {filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => handleOpenNote(note)}
                    onDelete={(e) => handleDeleteNote(e, note)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, note)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FAB - Floating Action Button */}
      <button
        onClick={handleCreateNote}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        title="Nova Nota"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom Tabs */}
      <BottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        urgentCount={urgentCount}
        favoritesCount={favoritesCount}
      />

      {/* Urgent Modal */}
      {showUrgentModal && criticalNote && (
        <UrgentModal
          note={criticalNote}
          onMarkAsDone={handleMarkAsDone}
          onSnooze={handleSnooze}
          onDelete={handleDeleteCritical}
          onIgnore={handleIgnore}
        />
      )}
    </div>
  );
}