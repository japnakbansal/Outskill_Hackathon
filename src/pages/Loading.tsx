import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const messages = [
  'Uncovering hidden corners…',
  'Weaving local stories into your journey…',
  'Balancing rest, food, and exploration…',
];

export function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="relative">
          <div className="w-20 h-20 mx-auto">
            <Loader2 className="w-full h-full text-slate-400 animate-spin" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto">
            <div className="w-full h-full rounded-full bg-blue-500/20 animate-ping" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
            Crafting your journey
          </h2>
          <p className="text-slate-600 text-lg animate-fade-in" key={messageIndex}>
            {messages[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
