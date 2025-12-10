import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { logout, user } = usePrivy();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xl sm:text-2xl font-bold text-white hover:opacity-80 transition"
          >
            Vela
          </button>

          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => navigate('/portfolio')}
              className={`text-xs sm:text-sm transition ${
                location.pathname === '/portfolio'
                  ? 'text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Portfolio
            </button>
            
            {user?.email && (
              <span className="hidden sm:block text-gray-400 text-xs sm:text-sm">
                {user.email.address}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-xs sm:text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
