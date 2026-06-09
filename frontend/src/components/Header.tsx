import { Heart, ShieldAlert, Cpu } from 'lucide-react';

interface HeaderProps {
  apiStatus: 'checking' | 'online' | 'offline';
  currentUser?: string;
}

export default function Header({ apiStatus, currentUser }: HeaderProps) {
  const formatTime = () => {
    // Elegant clinical session date string
    const d = new Date();
    return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  };

  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4 z-10" id="clinical-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Portal Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Heart className="w-6 h-6 text-white animate-[pulse_2.2s_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-[0.25em] text-red-500 uppercase font-bold">APOLLO CARDIOVASCULAR</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 border border-white/25 text-rose-400">
                v2.1-PROD
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans" id="header-title">
              Heart Disease Risk Intelligence Portal
            </h1>
          </div>
        </div>

        {/* Operating Environment Information */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-650" />
            <span>OPERATOR: <span className="text-white">{currentUser || 'muhammadusmanray'}</span></span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-650" />
            <span>TIMESTAMP: <span className="text-white">{formatTime()}</span></span>
          </div>

          <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded px-2.5 py-1">
            <span className="text-gray-500">API GATEWAY:</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
                apiStatus === 'checking' ? 'bg-amber-400 animate-pulse' :
                'bg-red-500'
              }`} />
              <span className={`font-semibold ${
                apiStatus === 'online' ? 'text-emerald-400' :
                apiStatus === 'checking' ? 'text-amber-400' :
                'text-red-450'
              }`}>
                {apiStatus === 'online' ? 'CONNECTED' : 
                 apiStatus === 'checking' ? 'DIAGNOSING...' : 
                 'OFFLINE FALLBACK'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
