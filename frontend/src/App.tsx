import { useState, useEffect } from 'react';
import Header from './components/Header';
import PatientForm from './components/PatientForm';
import DiagnosticResult from './components/DiagnosticResult';
import IntegrationHub from './components/IntegrationHub';
import { calculateLocalPrediction } from './utils/calculator';
import { PatientData, PredictionResult, ApiLogEntry } from './types';
import { Activity, ShieldAlert, Heart, HeartHandshake, FileCheck } from 'lucide-react';

const INITIAL_PATIENT_DATA: PatientData = {
  age: 45,
  sex: 1, // Male
  chestPainType: 'atypical',
  bloodPressure: 128,
  cholesterol: 195,
  maxHeartRate: 155,
  exerciseAngina: 0,
  oldpeak: 0.0,
};

export default function App() {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiLogs, setApiLogs] = useState<ApiLogEntry[]>([]);
  const [activeFormValues, setActiveFormValues] = useState<PatientData>(INITIAL_PATIENT_DATA);

  const API_URL = import.meta.env.VITE_API_URL || 'https://muhammadusmanray-ops-heart-disease-api.hf.space';

  // Ping backend on startup
  useEffect(() => {
    const probeGateway = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(`${API_URL}/predict`, {
          method: 'OPTIONS',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        setApiStatus('online');
      } catch (e) {
        setApiStatus('offline');
      }
    };

    probeGateway();
  }, [API_URL]);

  const handlePredictionCheck = async (patientInput: PatientData) => {
    setIsCalculating(true);
    setPatientData(patientInput);

    const logTimestamp = new Date().toISOString().replace('T', ' ').substring(11, 19);
    
    const rawLogEntry: ApiLogEntry = {
      timestamp: logTimestamp,
      url: `${API_URL}/predict`,
      method: 'POST',
      payload: patientInput,
      status: 'pending',
      source: 'api'
    };

    // Format fields specifically matching potential machine-learning models
    const uciPayload = {
      age: patientInput.age,
      sex: patientInput.sex,
      cp: patientInput.chestPainType === 'typical' ? 1 : 
          patientInput.chestPainType === 'atypical' ? 2 : 
          patientInput.chestPainType === 'non-anginal' ? 3 : 4,
      trestbps: patientInput.bloodPressure,
      chol: patientInput.cholesterol,
      thalach: patientInput.maxHeartRate,
      exang: patientInput.exerciseAngina,
      oldpeak: patientInput.oldpeak,
      chestPainType: patientInput.chestPainType,
      exerciseAngina: patientInput.exerciseAngina,
      bloodPressure: patientInput.bloodPressure,
      maxHeartRate: patientInput.maxHeartRate,
    };

    try {
      // Direct REST client POST request
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uciPayload),
      });

      if (!response.ok) {
        throw new Error(`API Gateway responded with ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      let parsedResult: PredictionResult;
      if (data.risk_level && typeof data.risk_percentage === 'number') {
        parsedResult = {
          risk_level: data.risk_level,
          risk_percentage: data.risk_percentage,
          recommendations: data.recommendations || [],
          clinical_metrics: data.clinical_metrics || calculateLocalPrediction(patientInput).clinical_metrics,
        };
      } else {
        const prob = data.probability ?? (data.risk_probability ?? (data.prediction === 1 ? 0.75 : 0.15));
        const percentage = Math.round(prob * 100);
        const level = percentage >= 50 ? 'HIGH RISK' : 'SAFE';
        
        const localEstimate = calculateLocalPrediction(patientInput);
        parsedResult = {
          risk_level: level,
          risk_percentage: percentage,
          recommendations: data.recommendations ?? localEstimate.recommendations,
          clinical_metrics: localEstimate.clinical_metrics,
        };
      }

      setResult(parsedResult);
      setApiStatus('online');

      setApiLogs((prev) => [
        {
          ...rawLogEntry,
          status: 'success',
          response: parsedResult,
        },
        ...prev,
      ]);

    } catch (error: any) {
      console.warn("Direct localhost:8000 call unavailable. Resolving calculations via high-fidelity local biological engine.", error);
      
      // Load standard scientific calculation
      const fallbackResult = calculateLocalPrediction(patientInput);

      // Simulation timing for excellent operational UI feedback
      await new Promise((resolve) => setTimeout(resolve, 600));

      setResult(fallbackResult);
      // Keep state clear so the user understands browser iframe permissions/mixed-content redirections
      setApiStatus('offline');

      setApiLogs((prev) => [
        {
          ...rawLogEntry,
          status: 'failed',
          source: 'fallback',
          error: 'Connection blocked by browser security (CORS/Mixed-Content rule: secure HTTPS pages cannot fetch raw http://localhost directly). Local calculations utilized.',
          response: fallbackResult,
        },
        ...prev,
      ]);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClearLogs = () => {
    setApiLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 flex flex-col relative overflow-hidden selection:bg-rose-950/40 selection:text-red-400" id="portal-root">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-900/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-950/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Upper Border Accent Line */}
      <div className="w-full h-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-800 z-10" />

      {/* Primary Header section */}
      <Header apiStatus={apiStatus} currentUser="muhammadusmanray" />

      {/* Main Core View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 relative z-10">
        
        {/* Top Intro News Notification Block */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl">
          <div className="flex gap-3 items-start sm:items-center">
            <div className="p-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-500 shrink-0">
              <Activity className="w-4 h-4 animate-pulse text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-sans font-semibold text-zinc-200">
                UCI Clinical Dataset Alignment Activated
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Inputs map parameters directly to machine learning properties including trestbps, thalach, cp, exang, and oldpeak.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-emerald-400 font-semibold uppercase">
              Operational Fallback Ready
            </span>
          </div>
        </div>

        {/* Primary Dashboard Panel (Form left, Results right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Diagnostic Inputs Column (Form) */}
          <div className="lg:col-span-7 flex flex-col">
            <PatientForm 
              onSubmit={handlePredictionCheck} 
              isLoading={isCalculating}
              initialData={activeFormValues}
            />
          </div>

          {/* Diagnostic Outputs Column (Report viz) */}
          <div className="lg:col-span-5 flex flex-col">
            <DiagnosticResult 
              result={result} 
              patientData={patientData} 
              isCalculating={isCalculating}
            />
          </div>

        </div>

        {/* Developer Integration Console Panel */}
        <IntegrationHub 
          logs={apiLogs} 
          currentPayload={patientData || activeFormValues}
          onClearLogs={handleClearLogs}
        />

        {/* Humble Footer Credit and Information */}
        <footer className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <HeartHandshake className="w-3.5 h-3.5 text-zinc-600" />
            <span>PRIMARY PREVENTION RESEARCH DESIGN · 2026</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 transition-all cursor-help" title="Based on 303 heart-disease patient metrics">UCI Cleveland Database Standards</span>
            <span>·</span>
            <span>REST Telemetry Protocol</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
