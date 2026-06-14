import sys
import os

# Root path add karo taake main.py aur saved_model access ho sake
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from mangum import Mangum

# Vercel serverless handler
handler = Mangum(app, lifespan="off")
