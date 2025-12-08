import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { useItinerary } from '../hooks/useItinerary';
import { Compass, Sparkles, LogOut, Calendar, MapPin } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { navigate } = useNavigate();
  const { lastItinerary } = useItinerary();

  const handleLogout = async () => {
    await signOut();
    navigate('landing');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 pb-8">
      <div className="max-w-md mx-auto pt-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif text-slate-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              Welcome back
            </h1>
            <p className="text-slate-600 text-sm">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {lastItinerary && (
          <div
            onClick={() => navigate('itinerary')}
            className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Last Trip</h3>
              <div className="text-xs text-slate-400">
                {lastItinerary.generatedAt && formatDate(lastItinerary.generatedAt)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-semibold text-slate-900">{lastItinerary.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{lastItinerary.duration} days</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-700">Start a new journey</h2>

          <button
            onClick={() => navigate('tripInput', 'plan')}
            className="w-full bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Compass className="w-6 h-6 text-blue-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">Plan My Trip</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tell us what matters most—your pace, budget, and the experiences you crave
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('tripInput', 'surprise')}
            className="w-full bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                <Sparkles className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">Surprise Me</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pick a place and duration—we'll weave you a story worth living
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
