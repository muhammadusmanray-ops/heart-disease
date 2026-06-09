# Heart Disease Risk Intelligence Portal 🫀

An industry-aligned machine learning application that predicts heart disease risk using clinical patient data. The portal integrates a tuned scikit-learn machine learning model, a FastAPI backend, and a modern React + Vite + TypeScript frontend.

## 🌟 Features
- **High-Recall Machine Learning:** Custom 30% probability threshold tuned specifically for medical safety, reducing false negatives to ensure high-risk cases are not missed.
- **Interactive Telemetry Dashboard:** A premium, dark-mode visual interface built with React, Tailwind CSS, and Lucide React.
- **FastAPI Core Gateway:** High-performance backend API serving real-time model predictions.
- **Interactive Logs & Debugger:** Developer console built directly into the UI showing JSON payloads, HTTP traffic, and local fallback estimates.

---

## 🛠️ Technology Stack
- **Machine Learning:** Python, Pandas, Scikit-Learn, Joblib, Jupyter Notebook.
- **Backend:** FastAPI, Uvicorn, Pydantic, CORS Middleware.
- **Frontend:** React (v19), TypeScript, Vite, Tailwind CSS, Motion, Lucide Icons.

---

## ⚙️ Project Structure
```text
├── 01_Data_Exploration.ipynb  # Jupyter Notebook with data analysis & model training
├── main.py                    # FastAPI server code
├── saved_model/               # Serialized ML model & scaler files
│   ├── heart_disease_model.pkl
│   └── scaler.pkl
└── frontend/                  # React Vite App
    ├── src/                   # React Components and Page Views
    ├── package.json           # Node.js dependencies
    └── index.html
```

---

## 🚀 Local Setup & Installation

### 1. Backend Setup
1. Navigate to the project root directory.
2. Activate your Python virtual environment and run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or the URL shown in your terminal) in your browser.

---

## 📈 ML Model Performance & Clinical Alignment
The model was trained on the **UCI Heart Disease Dataset** containing 920 patient records.
- **Recall Target:** In healthcare, missing a sick patient (False Negative) is far more dangerous than flag-checking a healthy patient (False Positive).
- **Optimization:** We adjusted the decision threshold to **30% (0.30)** instead of the standard 50%, resulting in a highly sensitive clinical warning system (approx. **93.5% Recall**).
