import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. FastAPI App initialize karna
app = FastAPI(title="Heart Disease Prediction API")

# CORS middleware taake frontend is API ko call kar sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Model aur Scaler load karna
MODEL_PATH = "saved_model/heart_disease_model.pkl"
SCALER_PATH = "saved_model/scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# 3. Input Data ka format (Pydantic model) matching React Frontend payload
class PatientData(BaseModel):
    age: float
    sex: int
    cp: int
    trestbps: float
    chol: float
    thalach: float
    exang: int
    oldpeak: float
    chestPainType: str
    exerciseAngina: int
    bloodPressure: float
    maxHeartRate: float

# 4. Predict Endpoint
@app.post("/predict")
def predict_heart_disease(data: PatientData):
    # Model/Scaler expects 27 columns in this EXACT order
    input_dict = {
        'id': 0,  # Placeholder
        'age': data.age,
        'trestbps': data.trestbps,
        'chol': data.chol,
        'thalch': data.thalach,  # mapping thalach to thalch
        'oldpeak': data.oldpeak,
        'sex_Male': 1 if data.sex == 1 else 0,
        'dataset_Hungary': 0,
        'dataset_Switzerland': 0,
        'dataset_VA Long Beach': 0,
        'cp_atypical angina': 1 if data.chestPainType == 'atypical' else 0,
        'cp_non-anginal': 1 if data.chestPainType == 'non-anginal' else 0,
        'cp_typical angina': 1 if data.chestPainType == 'typical' else 0,
        'fbs_True': 0,  # Default to False (0) since form doesn't collect it
        'restecg_normal': 1,  # Default to normal (1)
        'restecg_st-t abnormality': 0,
        'exang_True': 1 if data.exang == 1 else 0,
        'slope_downsloping': 0,
        'slope_flat': 1,  # Default safe assumption
        'slope_upsloping': 0,
        'ca_1.0': 0,
        'ca_2.0': 0,
        'ca_3.0': 0,
        'ca_Unknown': 1,  # Default to Unknown since not collected
        'thal_fixed defect': 0,
        'thal_normal': 1,  # Default to normal since not collected
        'thal_reversable defect': 0
    }
    
    # DataFrame mein convert karna
    input_df = pd.DataFrame([input_dict])
    
    # Pura dataframe scale karna kyunki scaler 27 columns par fit hua tha
    scaled_data = scaler.transform(input_df)
    
    # Model prediction probability
    probabilities = model.predict_proba(scaled_data)[:, 1]
    prediction_prob = float(probabilities[0])
    
    # 30% rule threshold
    threshold = 0.3
    result = "HIGH RISK" if prediction_prob >= threshold else "SAFE"
    
    return {
        "status": "success",
        "prediction": result,
        "probability": prediction_prob,  # React expects decimal probability (e.g. 0.75 for 75%)
        "risk_level": result,
        "risk_percentage": round(prediction_prob * 100)
    }

@app.get("/")
def read_root():
    return {"message": "Heart Disease API is running successfully!"}
