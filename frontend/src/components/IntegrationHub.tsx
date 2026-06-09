import { useState } from 'react';
import { ApiLogEntry, PatientData } from '../types';
import { Terminal, Copy, Check, Info, Server, HelpCircle, CornerDownRight } from 'lucide-react';

interface IntegrationHubProps {
  logs: ApiLogEntry[];
  currentPayload: PatientData;
  onClearLogs?: () => void;
}

export default function IntegrationHub({ logs, currentPayload, onClearLogs }: IntegrationHubProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'json' | 'help'>('terminal');

  // Map the standard UCI dataset fields that their Python model might expect
  const uciPayload = {
    age: currentPayload.age,
    sex: currentPayload.sex,
    cp: currentPayload.chestPainType === 'typical' ? 1 : 
        currentPayload.chestPainType === 'atypical' ? 2 : 
        currentPayload.chestPainType === 'non-anginal' ? 3 : 4,
    trestbps: currentPayload.bloodPressure,
    chol: currentPayload.cholesterol,
    thalach: currentPayload.maxHeartRate,
    exang: currentPayload.exerciseAngina,
    oldpeak: currentPayload.oldpeak,
    // Add descriptive names too to be 100% resilient
    chestPainType: currentPayload.chestPainType,
    exerciseAngina: currentPayload.exerciseAngina,
    bloodPressure: currentPayload.bloodPressure,
    maxHeartRate: currentPayload.maxHeartRate,
  };

  const curlCommand = `curl -X POST http://localhost:8000/predict \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(uciPayload, null, 2)}'`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'terminal' ? curlCommand : JSON.stringify(uciPayload, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden mt-6 shadow-2xl" id="integration-hub">
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-900/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
            <Terminal className="w-4 h-4 text-red-500 animate-[pulse_3s_infinite]" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono tracking-wider text-white flex items-center gap-1.5">
              API GATEWAY LOGS &amp; DEBUGGER
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">http://localhost:8000/predict Integration Hub</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'terminal' ? 'bg-red-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            cURL Request
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'json' ? 'bg-red-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Raw JSON
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'help' ? 'bg-red-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Local Setup
          </button>
        </div>
      </div>

      {/* Main Grid: Code view left, Transaction Logs right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left pane: cURL/JSON Console */}
        <div className="lg:col-span-7 flex flex-col h-[280px] bg-black/20 border border-white/10 rounded-xl relative group">
          {/* Console Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
            <span className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              {activeTab === 'terminal' ? 'terminal_command.sh' : activeTab === 'json' ? 'payload.json' : 'local_deployment.md'}
            </span>
            <button
              onClick={handleCopy}
              className="text-[10px] font-mono flex items-center gap-1 text-gray-300 hover:text-white transition-all border border-white/10 bg-white/5 px-2.5 py-0.5 rounded cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-red-400" />
                  Copy Text
                </>
              )}
            </button>
          </div>

          {/* Console Body */}
          <div className="p-4 flex-1 overflow-auto text-[11px] font-mono leading-relaxed text-gray-300">
            {activeTab === 'terminal' && (
              <pre className="whitespace-pre-wrap text-zinc-400 select-all selection:bg-rose-950/50">
                <span className="text-red-500">$</span> {curlCommand}
              </pre>
            )}

            {activeTab === 'json' && (
              <pre className="whitespace-pre-wrap text-emerald-400 select-all selection:bg-rose-950/50">
                {JSON.stringify(uciPayload, null, 2)}
              </pre>
            )}

            {activeTab === 'help' && (
              <div className="space-y-3 font-mono text-gray-400 leading-normal">
                <div className="flex gap-2 items-start text-xs text-red-500 font-bold">
                  <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>PREVIEW PLATFORM &amp; MIXED CONTENT WARNING:</span>
                </div>
                <p className="text-[10.5px]">
                  Browsers enforce a strict <strong className="text-white">Mixed Content Blocker</strong> which forbids secure <strong className="text-white">HTTPS</strong> applications (this hosted preview site) from making raw client-side calls to insecure local <strong className="text-white">HTTP</strong> services (<span className="text-red-400">http://localhost:8000</span>).
                </p>
                <div className="border border-white/10 bg-white/5 p-2.5 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-white uppercase block">How to connect locally:</span>
                  <div className="flex gap-1.5 items-start text-[10px]">
                    <span className="text-gray-505 shrink-0">1.</span>
                    <span>Download or clone this repository.</span>
                  </div>
                  <div className="flex gap-1.5 items-start text-[10px]">
                    <span className="text-gray-505 shrink-0">2.</span>
                    <span>Boot your local python backend server listening on <span className="text-red-400">port 8000</span>.</span>
                  </div>
                  <div className="flex gap-1.5 items-start text-[10px]">
                    <span className="text-gray-505 shrink-0">3.</span>
                    <span>Run <span className="text-white font-semibold">npm run dev</span> to access the site via local <span className="text-amber-400">http://localhost:3000</span>. All REST telemetry will resolve smoothly!</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Transaction History Logs */}
        <div className="lg:col-span-5 flex flex-col h-[280px] bg-black/20 border border-white/10 rounded-xl relative overflow-hidden">
          {/* Section title */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
            <span className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-red-500" />
              API TRANSACTION LOGS ({logs.length})
            </span>
            {logs.length > 0 && onClearLogs && (
              <button
                onClick={onClearLogs}
                className="text-[9px] font-mono text-gray-400 hover:text-white transition-all border border-white/10 bg-white/5 px-2 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Logs body */}
          <div className="flex-1 overflow-auto p-3 space-y-2 font-mono scrollbar-thin">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-[10px] text-gray-500">Console is idle. Trigger a prediction analysis to register outgoing transactions.</p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-lg p-2 bg-white/5 text-[10px] leading-tight transition-all ${
                    log.status === 'success' ? 'border-emerald-500/20' :
                    log.status === 'failed' ? 'border-amber-500/20' : 'border-white/10'
                  }`}
                >
                  {/* Log meta */}
                  <div className="flex items-center justify-between gap-1 mb-1 border-b border-white/5 pb-1 text-[9px] text-gray-500">
                    <span>{log.timestamp}</span>
                    <span className={`px-1 rounded font-bold ${
                      log.source === 'api' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-550/20'
                    }`}>
                      {log.source === 'api' ? 'API DIRECT' : 'LOCAL FALLBACK'}
                    </span>
                  </div>

                  {/* Endpoint detail */}
                  <div className="flex items-center gap-1 text-gray-300 mt-1">
                    <span className="font-bold text-red-400">POST</span>
                    <span className="text-gray-400 break-all truncate text-[9.5px]" title={log.url}>{log.url}</span>
                  </div>

                  {/* Result payload summary */}
                  <div className="mt-1 pb-1 flex justify-between items-center bg-black/20 px-1 py-0.5 rounded text-[9.5px]">
                    <span className="text-gray-500">STATUS:</span>
                    <span className={`font-semibold ${
                      log.status === 'success' ? 'text-emerald-400' :
                      log.status === 'failed' ? 'text-amber-500' : 'text-gray-400'
                    }`}>
                      {log.status === 'success' ? 'RESOLVED (200 OK)' :
                       log.status === 'failed' ? 'REDIRECTED / FALLBACK' : 'PENDING'}
                    </span>
                  </div>

                  {/* Diagnostic prediction summary */}
                  {log.response && (
                    <div className="mt-1 text-gray-300 flex items-center justify-between text-[9.5px]">
                      <span>RESULT:</span>
                      <span className={`font-bold ${log.response.risk_level === 'HIGH RISK' ? 'text-red-500' : 'text-emerald-400'}`}>
                        {log.response.risk_level} ({log.response.risk_percentage}%)
                      </span>
                    </div>
                  )}

                  {/* Network details for explanation */}
                  {log.error && (
                    <div className="mt-1.5 text-[8.5px] border border-red-500/10 bg-red-500/5 p-1 rounded text-red-400 leading-normal">
                      <CornerDownRight className="w-2.5 h-2.5 inline mr-1" />
                      {log.error}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
