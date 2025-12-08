import { useAuth } from './contexts/AuthContext';
import { useNavigate } from './hooks/useNavigate';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { TripInput } from './pages/TripInput';
import { Loading } from './pages/Loading';
import { Itinerary } from './pages/Itinerary';

function App() {
  const { loading } = useAuth();
  const { currentPage } = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const pages = {
    landing: <Landing />,
    auth: <Auth />,
    dashboard: <Dashboard />,
    tripInput: <TripInput />,
    loading: <Loading />,
    itinerary: <Itinerary />,
  };

  return <div className="animate-fade-in">{pages[currentPage]}</div>;
}

export default App;
