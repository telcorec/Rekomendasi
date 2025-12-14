from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Load model-tools
model = joblib.load("model_offer.joblib")
preprocessor = joblib.load("preprocessor_offer.joblib")
encoder = joblib.load("encoder_offer.joblib")

class OfferInput(BaseModel):
    plan_type: str
    device_brand: str
    avg_data_usage_gb: float
    pct_video_usage: float
    avg_call_duration: float
    sms_freq: int
    monthly_spend: float
    topup_freq: int
    travel_score: int
    complaint_count: int

@app.get("/")
def home():
    return {"message": "ML Offer API is running ✅"}

@app.post("/predict")
def predict(data: OfferInput):
    df = pd.DataFrame([data.dict()])

    # Preprocess
    X = preprocessor.transform(df)

    # Predict
    pred = model.predict(X)[0]

    # Decode
    result = encoder.inverse_transform([pred])[0]

    return {"prediction": result}
