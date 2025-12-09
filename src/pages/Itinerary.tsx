import { useState } from 'react';
import { useItinerary } from '../hooks/useItinerary';
import { useNavigate } from '../hooks/useNavigate';
import { ArrowLeft, BookOpen, CloudRain, Save, PlusCircle } from 'lucide-react';

export function Itinerary() {
  const { currentItinerary, saveItinerary } = useItinerary();
  const { navigate } = useNavigate();
  const [expandedStory, setExpandedStory] = useState<number | null>(null);
  const [expandedPlanB, setExpandedPlanB] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  if (!currentItinerary) {
    navigate('dashboard');
    return null;
  }

  const handleSave = () => {
    saveItinerary(currentItinerary);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50/95 via-blue-50/95 to-slate-100/95 backdrop-blur-lg border-b border-slate-200/50 px-4 py-4">
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-serif text-slate-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                {currentItinerary.destination}
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>{currentItinerary.duration} days</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                <span className="px-2 py-0.5 bg-slate-200 rounded-full text-xs font-medium">
                  {currentItinerary.workflowType === 'plan' ? 'Detailed' : 'Spontaneous'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {currentItinerary.days.map((day, index) => (
            <div
              key={day.dayNumber}
              className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Day {day.dayNumber}
                    </div>
                    {day.theme && (
                      <div className="mt-1 inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                        {day.theme}
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {day.activitiesSummary}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setExpandedStory(expandedStory === index ? null : index)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Local Story</span>
                  </button>

                  {expandedStory === index && (
                    <div className="bg-blue-50/50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed animate-fade-in">
                      {day.localStory}
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedPlanB(expandedPlanB === index ? null : index)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <CloudRain className="w-4 h-4" />
                    <span>Plan B</span>
                  </button>

                  {expandedPlanB === index && (
                    <div className="bg-slate-100/50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed animate-fade-in">
                      {day.planB}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200/50 p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
              disabled={saved}
            >
              <Save className="w-5 h-5" />
              <span>{saved ? 'Saved!' : 'Save this itinerary'}</span>
            </button>
            <button
              onClick={() => navigate('dashboard')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span>New Trip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
