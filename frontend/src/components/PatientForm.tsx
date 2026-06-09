import { useState, ChangeEvent, FormEvent } from 'react';
import { PatientData } from '../types';
import { HelpCircle, User, Activity, Flame, ShieldAlert, Heart, RefreshCw } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
  initialData: PatientData;
}

export default function PatientForm({ onSubmit, isLoading, initialData }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientData>(initialData);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Parse values safely preserving matching types
    let parsedValue: any = value;
    if (name === 'age' || name === 'bloodPressure' || name === 'cholesterol' || name === 'maxHeartRate') {
      parsedValue = value === '' ? '' : Math.round(Number(value));
    } else if (name === 'oldpeak') {
      parsedValue = value === '' ? '' : parseFloat(value);
    } else if (name === 'sex' || name === 'exerciseAngina') {
      parsedValue = Number(value) as 1 | 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const setManualField = (key: keyof PatientData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const loadDemoData = (preset: 'cardio-healthy' | 'cardio-borderline' | 'cardio-high-risk') => {
    switch (preset) {
      case 'cardio-healthy':
        setFormData({
          age: 32,
          sex: 0,
          chestPainType: 'non-anginal',
          bloodPressure: 115,
          cholesterol: 180,
          maxHeartRate: 175,
          exerciseAngina: 0,
          oldpeak: 0.0,
        });
        break;
      case 'cardio-borderline':
        setFormData({
          age: 52,
          sex: 1,
          chestPainType: 'atypical',
          bloodPressure: 135,
          cholesterol: 218,
          maxHeartRate: 142,
          exerciseAngina: 0,
          oldpeak: 0.8,
        });
        break;
      case 'cardio-high-risk':
        setFormData({
          age: 64,
          sex: 1,
          chestPainType: 'asymptomatic',
          bloodPressure: 155,
          cholesterol: 285,
          maxHeartRate: 110,
          exerciseAngina: 1,
          oldpeak: 2.6,
        });
        break;
    }
  };

  return (
    <form 
      onSubmit={handleFormSubmission} 
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      id="patient-diagnostic-form"
    >
      {/* Decorative radial gradient backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-6 bg-red-600 rounded-full shrink-0"></span>
          <div>
            <h2 className="text-md font-semibold tracking-wide text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500 animate-[pulse_1.8s_infinite]" />
              Patient Vitals & Diagnostics
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Configure clinical indicators for heart disease evaluation.</p>
          </div>
        </div>
        
        {/* Preset Selector */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10 scale-90 sm:scale-100">
          <button
            type="button"
            onClick={() => loadDemoData('cardio-healthy')}
            className="text-[10px] font-mono px-2 py-1 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            title="Load Optimal Health Preset"
          >
            Healthy
          </button>
          <button
            type="button"
            onClick={() => loadDemoData('cardio-borderline')}
            className="text-[10px] font-mono px-2 py-1 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            title="Load Borderline Elevated Preset"
          >
            Elevated
          </button>
          <button
            type="button"
            onClick={() => loadDemoData('cardio-high-risk')}
            className="text-[10px] font-mono px-2 py-1 rounded text-red-400 hover:text-red-350 hover:bg-white/5 transition-all"
            title="Load High Risk Cardiac Case Preset"
          >
            Critical
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* Input Column 1 */}
        <div className="space-y-4">
          {/* Age field */}
          <div className="relative group">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-medium text-gray-300 flex items-center gap-1.5" htmlFor="age">
                <span>AGE</span>
                <span className="text-gray-500 text-[10px] font-normal">(Years)</span>
              </label>
              <span className="text-xs font-mono text-red-400 font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                {formData.age || '--'}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                name="age"
                id="age"
                min="20"
                max="90"
                value={formData.age}
                onChange={handleChange}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none focus:ring-1 focus:ring-red-500/50"
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-gray-500 px-0.5 mt-1">
              <span>20 yrs</span>
              <span>55 yrs</span>
              <span>90 yrs</span>
            </div>
          </div>

          {/* Sex Field */}
          <div>
            <label className="block text-xs font-mono font-medium text-gray-300 mb-2" id="label-sex">
              BIOLOGICAL SEX
            </label>
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setManualField('sex', 1)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                  formData.sex === 1
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                id="btn-sex-male"
              >
                <User className="w-3.5 h-3.5" />
                MALE (1)
              </button>
              <button
                type="button"
                onClick={() => setManualField('sex', 0)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                  formData.sex === 0
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                id="btn-sex-female"
              >
                <User className="w-3.5 h-3.5" />
                FEMALE (0)
              </button>
            </div>
          </div>

          {/* Blood Pressure Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-medium text-gray-300 flex items-center gap-1.5" htmlFor="bloodPressure">
                RESTING BLOOD PRESSURE
                <span className="text-gray-500 text-[10px] font-normal">(trestbps, mmHg)</span>
              </label>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold border ${
                formData.bloodPressure >= 140 ? 'text-red-400 bg-red-950/20 border-red-900/30' :
                formData.bloodPressure >= 130 ? 'text-amber-400 bg-amber-950/10 border-amber-900/30' :
                'text-emerald-400 bg-emerald-950/10 border-emerald-900/30'
              }`}>
                {formData.bloodPressure} mmHg
              </span>
            </div>
            <input
              type="number"
              name="bloodPressure"
              id="bloodPressure"
              min="90"
              max="200"
              value={formData.bloodPressure}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-mono text-white text-sm"
            />
            <div className="flex justify-between text-[9px] font-mono text-gray-550 mt-1 px-1">
              <span>90 min limit</span>
              <span>120 (Optimal)</span>
              <span>200 max limit</span>
            </div>
          </div>

          {/* Serum Cholesterol Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-medium text-gray-300 flex items-center gap-1.5" htmlFor="cholesterol">
                SERUM CHOLESTEROL
                <span className="text-gray-500 text-[10px] font-normal">(chol, mg/dl)</span>
              </label>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold border ${
                formData.cholesterol >= 240 ? 'text-red-400 bg-red-950/20 border-red-900/30' :
                formData.cholesterol >= 200 ? 'text-amber-400 bg-amber-950/10 border-amber-900/30' :
                'text-emerald-400 bg-emerald-950/10 border-emerald-900/30'
              }`}>
                {formData.cholesterol} mg/dl
              </span>
            </div>
            <input
              type="number"
              name="cholesterol"
              id="cholesterol"
              min="100"
              max="600"
              value={formData.cholesterol}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-mono text-white text-sm"
            />
            <div className="flex justify-between text-[9px] font-mono text-gray-550 mt-1 px-1">
              <span>100 limit</span>
              <span>&lt;200 (Desirable)</span>
              <span>600 limit</span>
            </div>
          </div>
        </div>

        {/* Input Column 2 */}
        <div className="space-y-4">
          {/* Max Heart Rate Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-medium text-gray-300 flex items-center gap-1.5" htmlFor="maxHeartRate">
                MAX STRESS HEART RATE
                <span className="text-gray-500 text-[10px] font-normal">(thalach, bpm)</span>
              </label>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold border ${
                formData.maxHeartRate < 130 ? 'text-red-400 bg-red-950/20 border-red-900/30' :
                formData.maxHeartRate < 150 ? 'text-amber-400 bg-amber-950/10 border-amber-900/30' :
                'text-emerald-400 bg-emerald-950/10 border-emerald-900/30'
              }`}>
                {formData.maxHeartRate} bpm
              </span>
            </div>
            <input
              type="number"
              name="maxHeartRate"
              id="maxHeartRate"
              min="60"
              max="220"
              value={formData.maxHeartRate}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-mono text-white text-sm"
            />
            <div className="flex justify-between text-[9px] font-mono text-gray-550 mt-1 px-1">
              <span>60 (Bradycardia)</span>
              <span title="Physiological targets: 220 - Age">Peak: {220 - formData.age} bpm</span>
              <span>220 bpm</span>
            </div>
          </div>

          {/* Exercise Induced Angina Input */}
          <div>
            <label className="block text-xs font-mono font-medium text-gray-300 mb-2" id="label-exercise-angina">
              EXERCISE INDUCED ANGINA
            </label>
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setManualField('exerciseAngina', 1)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                  formData.exerciseAngina === 1
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/10 font-normal'
                }`}
                id="btn-angina-yes"
              >
                <Flame className="w-3.5 h-3.5" />
                YES (1)
              </button>
              <button
                type="button"
                onClick={() => setManualField('exerciseAngina', 0)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                  formData.exerciseAngina === 0
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/10 font-normal'
                }`}
                id="btn-angina-no"
              >
                NO (0)
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
              * Angina caused directly by physical exercise. Strongly correlates with major artery blockages.
            </p>
          </div>

          {/* Oldpeak Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-medium text-gray-300 flex items-center gap-1.5" htmlFor="oldpeak">
                OLDPEAK (ST DEPRESSION)
                <span className="text-gray-[500] text-[10px] font-normal">(0.0 - 6.2 mm)</span>
              </label>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold border ${
                formData.oldpeak >= 2.0 ? 'text-red-400 bg-red-950/20 border-red-900/30' :
                formData.oldpeak >= 1.0 ? 'text-amber-400 bg-amber-950/10 border-amber-900/30' :
                'text-emerald-400 bg-emerald-950/10 border-emerald-900/30'
              }`}>
                {formData.oldpeak.toFixed(1)} mm
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                name="oldpeak"
                id="oldpeak"
                min="0.0"
                max="6.2"
                step="0.1"
                value={formData.oldpeak}
                onChange={handleChange}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none focus:ring-1 focus:ring-red-500/50"
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1 px-1">
              <span>0.0 mm (Normal)</span>
              <span>3.0 mm (Elevated)</span>
              <span>6.2 mm (Severe)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chest Pain Type Dropdown - Segmented Display or Select block to handle beautiful graphics */}
      <div className="mb-6">
        <label className="block text-xs font-mono font-medium text-gray-300 mb-2.5">
          CHEST PAIN ANALYSIS (CP)
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { id: 'typical', code: 1, name: 'Typical Angina', desc: 'Squeezing clinical pressure, radiating discomfort' },
            { id: 'atypical', code: 2, name: 'Atypical Angina', desc: 'Sharp, localized, non-exertional symptoms' },
            { id: 'non-anginal', code: 3, name: 'Non-Anginal', desc: 'Spasmodic chest pain unrelated to blood flow' },
            { id: 'asymptomatic', code: 4, name: 'Silent / Asymptomatic', desc: 'No localized pain; high danger of quiet ischemia' }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setManualField('chestPainType', type.id)}
              className={`p-3 rounded-xl text-left transition-all border outline-none ${
                formData.chestPainType === type.id
                  ? 'bg-white/10 border-red-500 text-white shadow-xl ring-1 ring-red-500/40'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold tracking-tight font-sans block">{type.name}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${
                  formData.chestPainType === type.id ? 'bg-red-650 text-white font-bold' : 'bg-white/5 text-gray-500 border border-white/5'
                }`}>
                  CP-{type.code}
                </span>
              </div>
              <p className="text-[10px] leading-snug text-gray-500 line-clamp-2">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Submission Panel */}
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono leading-none">
          <HelpCircle className="w-4 h-4 text-gray-600" />
          <span>Cross-examine preset configurations.</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`relative group w-full sm:w-auto px-6 py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider overflow-hidden transition-all shadow-xl shadow-red-950/30 border-none outline-none ${
            isLoading 
              ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(220,38,38,0.4)]'
          }`}
          id="btn-check-risk"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              RUNNING HEART MODEL...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
              ANALYZE RISK PROFILE
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
