# 1. Base Python image use karna
FROM python:3.10-slim

# 2. Working directory set karna container ke andar
WORKDIR /app

# 3. requirements.txt ko copy karna aur install karna
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Baaki code aur model files ko copy karna
COPY main.py .
COPY saved_model/ ./saved_model/

# 5. Hugging Face Spaces default port 7860 par listen karta hai
EXPOSE 7860

# 6. Uvicorn web server ko run karna
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
