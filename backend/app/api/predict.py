from fastapi import APIRouter, HTTPException
import yfinance as yf
import numpy as np
from scipy.signal import stft
import tensorflow as tf
import os

router = APIRouter()

# --- 1. AUTO-DISCOVER AND LOAD THE MODEL ---
# Get the absolute path to the 'app' directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__)) # This is app/api/
APP_DIR = os.path.dirname(CURRENT_DIR)                   # This is app/
CNN_DIR = os.path.join(APP_DIR, "cnn")                   # This is app/cnn/

try:
    h5_files = [f for f in os.listdir(CNN_DIR) if f.endswith('.h5')]
    if not h5_files:
        raise FileNotFoundError(f"No .h5 model found in {CNN_DIR}")
        
    MODEL_PATH = os.path.join(CNN_DIR, h5_files[0])
    print(f"Auto-discovered CNN Model at: {MODEL_PATH}")

    # FIX: Add compile=False to bypass the MSE deserialization error
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    
    print("Model loaded successfully (Inference Mode)!")
except Exception as e:
    print(f"WARNING: Failed to load model. Error: {e}")
    model = None
    
except Exception as e:
    print(f"WARNING: Failed to load model. Error: {e}")
    model = None

# --- 2. SIGNAL PROCESSING MATH ---
def compute_spectrogram(signal_window):
    centered_signal = signal_window - np.mean(signal_window)
    f, t, Zxx = stft(centered_signal, fs=1.0, nperseg=16, noverlap=8)
    return np.abs(Zxx)**2 

# --- 3. THE ENDPOINT ---
@router.get("/")
def predict_future_price(symbol: str):
    if model is None:
        raise HTTPException(status_code=500, detail="CNN Model is not loaded on the server.")

    try:
        # Fetch the last ~3 months of data to ensure we have 60 trading days
        ticker = symbol if ".NS" in symbol or ".BO" in symbol else f"{symbol}.NS"
        df = yf.download(ticker, period="3mo", progress=False) 
        
        if len(df) < 60:
            raise HTTPException(status_code=400, detail=f"Not enough historical data for {symbol}.")

        # Grab exactly the last 60 close prices
        window = df['Close'].values.flatten()[-60:]
        current_price = float(window[-1])

        # Generate the Spectrogram 
        spec = compute_spectrogram(window)
        spec_max = np.max(spec) if np.max(spec) > 0 else 1
        spec_normalized = spec / spec_max

        # Format for the CNN: (Batch Size, Height, Width, Channels)
        input_tensor = np.expand_dims(np.expand_dims(spec_normalized, axis=0), axis=-1)

        # Ask the CNN for the predicted percentage movement
        predicted_pct_change = float(model.predict(input_tensor, verbose=0)[0][0])

        # Calculate the final Rupee price based on the percentage change
        predicted_price = current_price * (1 + (predicted_pct_change / 100))

        return {
            "symbol": symbol,
            "current_price": round(current_price, 2),
            "predicted_pct_change": round(predicted_pct_change, 3),
            "predicted_price": round(predicted_price, 2),
            "direction": "UP" if predicted_pct_change > 0 else "DOWN"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import time

@router.get("/backtest")
def get_backtest_results(symbol: str):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    try:
        ticker = symbol if ".NS" in symbol or ".BO" in symbol else f"{symbol}.NS"
        df = yf.download(ticker, period="6mo", progress=False)
        prices = df['Close'].values.flatten()
        
        results = []
        # Calculate for the last 30 trading days
        for i in range(len(prices) - 30, len(prices)):
            window = prices[i-60 : i]
            
            # STFT + Inference
            spec = compute_spectrogram(window)
            spec_max = np.max(spec) if np.max(spec) > 0 else 1
            input_tensor = np.expand_dims(np.expand_dims(spec / spec_max, axis=0), axis=-1)
            
            pred_pct = float(model.predict(input_tensor, verbose=0)[0][0])
            pred_price = float(window[-1]) * (1 + (pred_pct / 100))
            
            # Lightweight Charts needs 'time' as a Unix timestamp
            results.append({
                "time": int(df.index[i].timestamp()),
                "actual": round(float(prices[i]), 2),
                "predicted": round(float(pred_price), 2)
            })

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))