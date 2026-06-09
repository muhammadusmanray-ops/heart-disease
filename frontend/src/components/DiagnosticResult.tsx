import { PredictionResult, PatientData } from '../types';
import { Heart, ShieldCheck, ShieldAlert, BookOpen, ChevronRight, Activity, TrendingDown, HelpCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface DiagnosticResultProps {
  result: PredictionResult | null;
  patientData: PatientData | null;
  isCalculating: boolean;
}

export default function DiagnosticResult({ result, patientData, isCalculating }: DiagnosticResultProps) {
  if (isCalculating) {
    return (
      <div 
        className="h-full min-h-[480px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
        id="result-loading-state"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-[loading-bar_1.5s_infinite]" />
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <Heart className="w-16 h-16 text-rose-500 animate-[bounce_1.2s_infinite] fill-rose-500/20" />
            <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-ping" />
          </div>
          <div>
            <h3 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">Synchronizing Telemetry</h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">Modeling localized hemodynamics & ST Segment dynamics...</p>
          </div>
          
          {/* Simulated scanning loader lines */}
          <div className="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10 mt-2">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 h-full w-[60%] rounded-full animate-[loading-fill_2s_infinite_linear]" />
          </div>
        </div>
      </div>
    );
  }

  if (!result || !patientData) {
    return (
      <div 
        className="h-full min-h-[480px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
        id="result-empty-state"
      >
        {/* Ambient grids/accents */}
        <div className="absolute inset-0 bg-radial-grid opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          {/* Animated SVG ECG line */}
          <div className="w-32 h-16 mb-4 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">
            <svg viewBox="0 0 100 30" className="w-full h-full stroke-red-600 fill-none stroke-2">
              <path 
                d="M 0,15 L 25,15 L 30,15 L 35,5 L 38,25 L 42,12 L 44,15 L 48,15 L 100,15" 
                strokeDasharray="100" 
                strokeDashoffset="100" 
                className="animate-[ecg-line_3.5s_infinite_linear]"
              />
            </svg>
          </div>
          
          <h3 className="text-white font-sans font-semibold tracking-wide text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 shrink-0" />
            Awaiting Interactive Telemetry
          </h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Configure vital parameters on the left and click <strong className="text-red-400 font-semibold font-mono uppercase">Analyze Risk Profile</strong> to initiate deep scientific cardio predictive analysis.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-[9px] font-mono text-gray-450 bg-white/5 border border-white/10 px-2 py-1 rounded">
              UCI-Heart Cleveland Standards
            </span>
            <span className="text-[9px] font-mono text-gray-450 bg-white/5 border border-white/10 px-2 py-1 rounded">
              High Fidelity Calculations
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isHighRisk = result.risk_level === 'HIGH RISK';
  const strokeDashoffset = 339.29 - (339.29 * result.risk_percentage) / 100;

  return (
    <div 
      className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 relative shadow-2xl ${
        isHighRisk ? 'border-red-500/20' : 'border-emerald-500/20'
      }`}
      id="diagnostic-result-panel"
    >
      {/* Decorative colored glow representing risk severity */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700 ${
        isHighRisk ? 'bg-red-600/20' : 'bg-emerald-600/15'
      }`} />

      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div>
          <h2 className="text-md font-semibold tracking-wide text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            Predictive Cardiology Report
          </h2>
          <p className="text-xs text-gray-400 mt-1">Detailed statistical results and medical recommendations.</p>
        </div>
        <div className="text-[10px] uppercase tracking-wider font-semibold font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
          REPORT ID: <span className="text-white">#CP-{Math.floor(patientData.age + patientData.cholesterol)}</span>
        </div>
      </div>

      {/* Main Score Visualizer Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-center">
        {/* Ring Gauge (Columns 1-4) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="54"
                className="stroke-black/30 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                className="stroke-white/10 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                className={`fill-none transition-all duration-1000 ${
                  isHighRisk ? 'stroke-red-500' : 'stroke-emerald-500'
                }`}
                strokeWidth="8"
                strokeDasharray="339.29"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Inside Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">PROBABILITY</span>
              <span className={`text-3xl font-bold tracking-tight font-mono ${
                isHighRisk ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-emerald-450'
              }`}>
                {result.risk_percentage}%
              </span>
              <span className="text-[9px] font-mono text-gray-400">Cardiac Risk</span>
            </div>
          </div>
        </div>

        {/* Diagnosis Callout (Columns 5-12) */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border tracking-wider shadow-md ${
              isHighRisk 
                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
            }`}>
              {isHighRisk ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-500 animate-[pulse_1s_infinite]" />
                  HIGH CARDIOVASCULAR RISK
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  SAFE / LOW RISK PATIENT
                </>
              )}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">THRESHOLD: 50%</span>
          </div>

          <h3 className="text-gray-300 font-medium text-xs leading-relaxed" id="report-diagnosis-summary">
            {isHighRisk ? (
              <span>The system classifier has identified highly elevated warning signs associated with <strong>Coronary Artery Disease (CAD)</strong>. Standard diagnostics show multiple stress performance deviations. Immediate intervention is highly recommended.</span>
            ) : (
              <span>The patient is in a biologically optimal or manageable cardiovascular range. Continuing active lifestyle adjustments and regular physical screenings will preserve key cardiac reserves.</span>
            )}
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-gray-500 border-t border-white/10 pt-3">
            <div>AGE: <span className="text-white">{patientData.age} yr-old</span></div>
            <div>SEX: <span className="text-white">{patientData.sex === 1 ? 'Male' : 'Female'}</span></div>
            <div>STRESS HR: <span className="text-white">{patientData.maxHeartRate} bpm</span></div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Dashboard (4 cards) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Meter 1 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left hover:bg-white/10 transition-all cursor-default">
          <span className="block text-[9px] font-mono text-gray-500 tracking-wider">ARTERIAL LOAD</span>
          <span className="text-xs font-bold block mt-1 text-white">{patientData.bloodPressure} mmHg</span>
          <span className={`inline-block text-[9px] font-mono font-bold mt-1.5 px-1.5 py-0.5 rounded border ${
            result.clinical_metrics.arterial_load === 'Critical' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
            result.clinical_metrics.arterial_load === 'Elevated' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-405 border-emerald-500/20'
          }`}>
            {result.clinical_metrics.arterial_load}
          </span>
        </div>

        {/* Meter 2 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left hover:bg-white/10 transition-all cursor-default">
          <span className="block text-[9px] font-mono text-gray-500 tracking-wider">CARDIAC RESERVE</span>
          <span className="text-xs font-bold block mt-1 text-white">{patientData.maxHeartRate} bpm</span>
          <span className={`inline-block text-[9px] font-mono font-bold mt-1.5 px-1.5 py-0.5 rounded border ${
            result.clinical_metrics.cardiac_reserve === 'Impared' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
            result.clinical_metrics.cardiac_reserve === 'Reduced' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-405 border-emerald-500/20'
          }`}>
            {result.clinical_metrics.cardiac_reserve}
          </span>
        </div>

        {/* Meter 3 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left hover:bg-white/10 transition-all cursor-default">
          <span className="block text-[9px] font-mono text-gray-500 tracking-wider">CHOLESTEROL BAND</span>
          <span className="text-xs font-bold block mt-1 text-white">{patientData.cholesterol} mg/dl</span>
          <span className={`inline-block text-[9px] font-mono font-bold mt-1.5 px-1.5 py-0.5 rounded border ${
            result.clinical_metrics.cholesterol_bracket === 'High' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
            result.clinical_metrics.cholesterol_bracket === 'Borderline High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-405 border-emerald-500/20'
          }`}>
            {result.clinical_metrics.cholesterol_bracket}
          </span>
        </div>

        {/* Meter 4 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left hover:bg-white/10 transition-all cursor-default">
          <span className="block text-[9px] font-mono text-gray-500 tracking-wider">ST SEGMENT GAP</span>
          <span className="text-xs font-bold block mt-1 text-white">{patientData.oldpeak.toFixed(1)} mm</span>
          <span className={`inline-block text-[9px] font-mono font-bold mt-1.5 px-1.5 py-0.5 rounded border ${
            result.clinical_metrics.ischemia_marker === 'Severe ST Shift' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
            result.clinical_metrics.ischemia_marker === 'Mild ST Shift' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-405 border-emerald-500/20'
          }`}>
            {result.clinical_metrics.ischemia_marker}
          </span>
        </div>
      </div>

      {/* Clinical Guidance / Recommendations List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner">
        <h3 className="text-xs font-semibold tracking-wider font-mono text-zinc-300 flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-red-500 shrink-0" />
          TARGETED CLINICAL PREVENTION RECOMMENDATIONS
        </h3>
        <div className="space-y-2.5">
          {result.recommendations.map((rec, idx) => {
            const splitIndex = rec.indexOf(':');
            const prefix = splitIndex !== -1 ? rec.substring(0, splitIndex + 1) : '';
            const suffix = splitIndex !== -1 ? rec.substring(splitIndex + 1) : rec;

            return (
              <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-gray-300">
                <ChevronRight className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>
                  {prefix && <strong className="text-white font-semibold">{prefix}</strong>}
                  {suffix}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
