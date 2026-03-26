import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.signal import stft
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam

# ==========================================
# 1. UNIVERSAL DATA PREP
# ==========================================
print("Fetching training data...")
# We train on Reliance, but the MATH makes it universal
df = yf.download('RELIANCE.NS', start='2015-01-01', end='2024-01-01')
prices = df['Close'].values.flatten()

WINDOW_SIZE = 60  
PREDICT_AHEAD = 1 

def compute_spectrogram(signal_window):
    # Mean-center the window so the STFT only looks at volatility, not absolute price
    centered_signal = signal_window - np.mean(signal_window)
    f, t, Zxx = stft(centered_signal, fs=1.0, nperseg=16, noverlap=8)
    return np.abs(Zxx)**2 

print("Generating Universal STFT Spectrograms...")
X, y = [], []

for i in range(len(prices) - WINDOW_SIZE - PREDICT_AHEAD):
    window = prices[i : i + WINDOW_SIZE]
    future_price = prices[i + WINDOW_SIZE + PREDICT_AHEAD - 1]
    last_price_in_window = window[-1]
    
    # Calculate Percentage Return (This makes it work for ALL stocks)
    pct_return = (future_price - last_price_in_window) / last_price_in_window
    
    # Generate the 2D Spectrogram
    spec = compute_spectrogram(window)
    
    # We normalize the spectrogram itself so extreme volatility doesn't blow up the CNN
    spec_max = np.max(spec) if np.max(spec) > 0 else 1
    spec_normalized = spec / spec_max
    
    X.append(spec_normalized)
    y.append(pct_return)

X = np.expand_dims(np.array(X), axis=-1) 
y = np.array(y) * 100 # Multiply by 100 to predict actual % (e.g., 1.5 instead of 0.015)

# Split Train/Test
split_idx = int(len(X) * 0.8)
X_train, X_test = X[:split_idx], X[split_idx:]
y_train, y_test = y[:split_idx], y[split_idx:]

# ==========================================
# 2. UNIVERSAL CNN ARCHITECTURE
# ==========================================
print("Building Universal CNN Model...")
model = Sequential([
    Conv2D(32, kernel_size=(3, 3), activation='relu', padding='same', input_shape=(X.shape[1], X.shape[2], 1)),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    
    Conv2D(64, kernel_size=(3, 3), activation='relu', padding='same'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.3),
    Dense(1, activation='linear') # Output is a single number: The % change!
])

model.compile(optimizer=Adam(learning_rate=0.0005), loss='mse')
model.summary()

print("Training God Model on RTX 4060...")
model.fit(X_train, y_train, epochs=30, batch_size=32, validation_data=(X_test, y_test), verbose=1)

# ==========================================
# 3. SAVE THE BEAST
# ==========================================
model.save("universal_stft_cnn.h5")
print("Saved as universal_stft_cnn.h5. Ready to predict ANY stock.")