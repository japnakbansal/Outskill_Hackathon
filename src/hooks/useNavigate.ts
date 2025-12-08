import { create } from './store';

type PageType = 'landing' | 'auth' | 'dashboard' | 'tripInput' | 'loading' | 'itinerary';

interface NavigationStore {
  currentPage: PageType;
  workflowType: 'plan' | 'surprise' | null;
  navigate: (page: PageType, workflow?: 'plan' | 'surprise') => void;
  setWorkflowType: (workflow: 'plan' | 'surprise') => void;
}

const useNavigationStore = create<NavigationStore>((set) => ({
  currentPage: 'landing',
  workflowType: null,
  navigate: (page, workflow) => set({
    currentPage: page,
    ...(workflow && { workflowType: workflow })
  }),
  setWorkflowType: (workflow) => set({ workflowType: workflow }),
}));

export function useNavigate() {
  return useNavigationStore();
}
