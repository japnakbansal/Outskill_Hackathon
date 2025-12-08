import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';
import { Compass, Sparkles } from 'lucide-react';

export function Landing() {
  const { navigate } = useNavigate();
  const { user } = useAuth();

  const handleWorkflowSelect = (workflow: 'plan' | 'surprise') => {
    if (user) {
      navigate('tripInput', workflow);
    } else {
      navigate('auth', workflow);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-serif text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
            Wander
          </h1>
          <p className="text-slate-600 text-lg" style={{ fontFamily: 'system-ui, sans-serif' }}>
            Your next journey, thoughtfully crafted
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleWorkflowSelect('plan')}
            className="w-full bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Compass className="w-6 h-6 text-blue-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Plan My Trip</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tell us what matters most—your pace, budget, and the experiences you crave
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleWorkflowSelect('surprise')}
            className="w-full bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                <Sparkles className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Surprise Me</h2>
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
