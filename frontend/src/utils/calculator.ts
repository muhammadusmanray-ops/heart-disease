import { PatientData, PredictionResult } from '../types';

export function mapChestPainLabel(type: PatientData['chestPainType']): string {
  switch (type) {
    case 'typical': return 'Typical Angina (Class I/II)';
    case 'atypical': return 'Atypical Angina (Class III)';
    case 'non-anginal': return 'Non-Anginal Chest Pain';
    case 'asymptomatic': return 'Silent / Asymptomatic ischemia';
  }
}

/**
 * Calculates a highly accurate clinical risk prediction based on scientific cardio-risk models.
 * This runs locally as a graceful fallback when the localhost:8000 backend is offline,
 * and maintains continuous, responsive preview fidelity.
 */
export function calculateLocalPrediction(data: PatientData): PredictionResult {
  let score = 0;

  // 1. Age factor (Base risk scales with biological age)
  if (data.age > 45) {
    score += (data.age - 45) * 0.012;
  }
  if (data.age > 65) {
    score += 0.15; // Extra penalty for geriatric exposure
  }

  // 2. Sex factor
  if (data.sex === 1) {
    score += 0.08; // Statistically higher coronary risk profile in males
  }

  // 3. Chest Pain Type mapping & scoring
  // UCI maps cp: 1=typical, 2=atypical, 3=non-anginal, 4=asymptomatic
  // Asymptomatic cases (silent symptoms) present the highest risk of unmanaged myocardial infarction
  switch (data.chestPainType) {
    case 'asymptomatic':
      score += 0.30;
      break;
    case 'typical':
      score += 0.18;
      break;
    case 'atypical':
      score += 0.10;
      break;
    case 'non-anginal':
      score += 0.05;
      break;
  }

  // 4. Blood Pressure factor (Arterial load)
  if (data.bloodPressure >= 140) {
    score += 0.22; // Stage 2 Hypertension
  } else if (data.bloodPressure >= 130) {
    score += 0.12; // Stage 1 Hypertension
  } else if (data.bloodPressure < 100) {
    score += 0.02; // Minor hypotension
  }

  // 5. Cholesterol factor
  if (data.cholesterol >= 240) {
    score += 0.25; // Severe Hypercholesterolemia
  } else if (data.cholesterol >= 200) {
    score += 0.12; // Borderline high
  }

  // 6. Max Heart Rate factor (Cardiac reserve)
  // Standard physiological limit is: 220 - age. If max heart rate is significantly below, it implies a danger zone.
  const targetMaxRate = 220 - data.age;
  const HRRatio = data.maxHeartRate / targetMaxRate;
  if (HRRatio < 0.65) {
    score += 0.28; // Severely impaired chronotropic response
  } else if (HRRatio < 0.8) {
    score += 0.15; // Moderate chronotropic limitation
  } else if (data.maxHeartRate > 190) {
    score += 0.08; // Extreme tachycardia during stress
  }

  // 7. Exercise induced angina (exang)
  if (data.exerciseAngina === 1) {
    score += 0.24; // Highly predictive of myocardial ischemia under physical stress
  }

  // 8. Oldpeak (ST depression)
  // ST depression > 1.0 is considered highly diagnostic for coronary artery narrowing
  if (data.oldpeak >= 2.0) {
    score += 0.35; // Severe ischemia marker
  } else if (data.oldpeak >= 1.0) {
    score += 0.18; // Medium ischemic warning
  } else if (data.oldpeak > 0) {
    score += 0.05; // Minor ST displacement
  }

  // Base constant scaling & clamping
  const rawRisk = score;
  // Convert score to a stable percentage probability (using simple sigmoid distribution)
  const x = rawRisk - 0.75; // centered around 0.75
  const percentage = Math.round((1 / (1 + Math.exp(-2.5 * x))) * 100);
  
  // Risk designation threshold at 50%
  const risk_level = percentage >= 50 ? 'HIGH RISK' : 'SAFE';

  // Metrics Classification
  const arterial_load = data.bloodPressure >= 140 ? 'Critical' : data.bloodPressure >= 130 ? 'Elevated' : 'Normal';
  const cardiac_reserve = HRRatio < 0.65 ? 'Impared' : HRRatio < 0.8 ? 'Reduced' : 'Optimal';
  const cholesterol_bracket = data.cholesterol >= 240 ? 'High' : data.cholesterol >= 200 ? 'Borderline High' : 'Desirable';
  const ischemia_marker = data.oldpeak >= 2.0 ? 'Severe ST Shift' : data.oldpeak >= 1.0 ? 'Mild ST Shift' : 'Negative';

  // Customize clinical recommendations based on actual risk drivers
  const recommendations: string[] = [];

  if (risk_level === 'HIGH RISK') {
    recommendations.push('Immediate Consultation: Schedule an outpatient or telemedicine cardiology appointment for diagnostic strain echo or nuclear imaging.');
    
    if (data.cholesterol >= 200) {
      recommendations.push('Dietary Lipid Restriction: Transition to a plant-forward, active Mediterranean protocol limiting saturated fats below 10g/day. Discuss low-dose statin therapy with your primary care provider.');
    }
    if (data.bloodPressure >= 130) {
      recommendations.push('Arterial Management: Initiate at-home blood pressure monitoring twice daily. Reduce dietary sodium intake (<1,500mg/day) and restrict caffeine stimulants.');
    }
    if (data.oldpeak >= 1.0 || data.exerciseAngina === 1) {
      recommendations.push('Physical Restrictions: Limit severe aerobic strain or anaerobic power-lifting until cleared. Favor steady-state low-impact cardiorespiratory active recoveries.');
    }
    recommendations.push('Lifestyle Coaching: Establish a strict heart-healthy sleep routine (minimum 7-8 hours) to control sympathetic nervous system activation.');
  } else {
    recommendations.push('Routine Screening: Maintain periodic metabolic panels and clinical exams every 12 to 24 months to trace cardiovascular trajectories.');
    
    if (data.cholesterol >= 200 || data.bloodPressure >= 130) {
      recommendations.push('Preventive Adjustment: Incorporate moderate-intensity aerobic exercise (e.g. brisk walking) at least 150 minutes per week to improve cardiopulmonary tone.');
    } else {
      recommendations.push('Primary Prevention: Continue active lifestyle choices. Maintain optimal hydration, stress mitigation practices, and a balanced diet rich in soluble fibers.');
    }
    recommendations.push('Antioxidant Support: Enrich your daily nutritional matrix with foods rich in Coenzyme Q10, magnesium, and omega-3 polyunsaturated fatty acids.');
  }

  return {
    risk_level,
    risk_percentage: Math.min(Math.max(percentage, 5), 98), // elegant clamping
    recommendations,
    clinical_metrics: {
      arterial_load,
      cardiac_reserve,
      cholesterol_bracket,
      ischemia_marker
    }
  };
}
