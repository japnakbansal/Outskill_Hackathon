import { create } from './store';
import { Itinerary } from '../types';

interface ItineraryStore {
  currentItinerary: Itinerary | null;
  lastItinerary: Itinerary | null;
  setCurrentItinerary: (itinerary: Itinerary) => void;
  saveItinerary: (itinerary: Itinerary) => void;
  clearCurrentItinerary: () => void;
}

const STORAGE_KEY = 'wander_last_itinerary';

const loadFromStorage = (): Itinerary | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (itinerary: Itinerary) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
  } catch {
    console.error('Failed to save itinerary');
  }
};

const useItineraryStore = create<ItineraryStore>((set) => ({
  currentItinerary: null,
  lastItinerary: loadFromStorage(),
  setCurrentItinerary: (itinerary) => set({ currentItinerary: itinerary }),
  saveItinerary: (itinerary) => {
    const withTimestamp = { ...itinerary, generatedAt: new Date().toISOString() };
    saveToStorage(withTimestamp);
    set({ lastItinerary: withTimestamp, currentItinerary: withTimestamp });
  },
  clearCurrentItinerary: () => set({ currentItinerary: null }),
}));

export function useItinerary() {
  return useItineraryStore();
}
