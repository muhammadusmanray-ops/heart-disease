export interface PatientData {
  age: number;
  sex: 1 | 0; // 1 = Male, 0 = Female
  chestPainType: 'typical' | 'atypical' | 'non-anginal' | 'asymptomatic';
  bloodPressure: number; // Trestbps (mmHg)
  cholesterol: number; // Chol (mg/dl)
  maxHeartRate: number; // Thalach (bpm)
  exerciseAngina: 1 | 0; // 1 = Yes, 0 = No
  oldpeak: number; // ST depression
}

export interface PredictionResult {
  risk_level: 'HIGH RISK' | 'SAFE';
  risk_percentage: number;
  recommendations: string[];
  clinical_metrics: {
    arterial_load: 'Normal' | 'Elevated' | 'Critical';
    cardiac_reserve: 'Optimal' | 'Reduced' | 'Impared';
    cholesterol_bracket: 'Desirable' | 'Borderline High' | 'High';
    ischemia_marker: 'Negative' | 'Mild ST Shift' | 'Severe ST Shift';
  };
}

export interface ApiLogEntry {
  timestamp: string;
  url: string;
  method: 'POST';
  payload: any;
  status: 'pending' | 'success' | 'failed';
  response?: any;
  error?: string;
  source: 'api' | 'fallback';
}
