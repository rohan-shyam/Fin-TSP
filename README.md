**Name:** Rohan Shyam

**Registration Number:** TCR24CS056

# 💹 Fin-TSP: Neural Time-Series Terminal

**Fin-TSP** (Financial Time Series Prediction) is a high-performance Neural Terminal designed for the Indian Stock Market (NSE/BSE). This project moves away from traditional 1D price-action models, treating market dynamics as a **Computer Vision** problem. By converting raw price action into **2D Spectrograms** via Short-Time Fourier Transform (STFT), a **Convolutional Neural Network (CNN)** identifies hidden spectral patterns in volatility to predict next-day price movements.

---

## 🛠️ Technical Stack

### **Backend (The Engine)**
* **Framework:** FastAPI (Python 3.11)
* **Deep Learning:** TensorFlow-CPU (Memory-optimized for 512MB RAM constraints)
* **Signal Processing:** SciPy (STFT spectral mapping)
* **Data Ingestion:** yFinance (Real-time NSE/BSE data)
* **Deployment:** Render (Web Service)

### **Frontend (The Terminal)**
* **Framework:** Next.js 15 (App Router / Turbopack)
* **Styling:** Tailwind CSS (Neural-Dark Theme)
* **Visuals:** Chart.js, Lucide React, & Framer Motion (Glow-effects/Animations)
* **Deployment:** Vercel

---

## 🧠 Core Architecture & Pipeline

The prediction pipeline follows a rigorous four-stage process:

1.  **Normalization:** Raw OHLC data is scaled to ensure feature consistency across 5,300+ supported assets.
2.  **STFT Mapping:** 1D price time-series is transformed into a 60x60 spectral image, capturing both time and frequency domains.
3.  **CNN Inference:**
    * **Conv2D Layers:** Slide kernels over the spectrogram to detect "edges" in volatility and spectral density.
    * **MaxPool:** Downsamples features to ensure translation invariance.
    * **Dense Head:** A linear head performs the final regression to output the **Predicted T+1 Price**.
4.  **Backtesting:** The system compares predictions against historical truth to calculate **Directional Accuracy** metrics.

---

## 🚀 Deployment & Challenges Overcome

Deploying a deep learning model on a free-tier cloud environment required significant infrastructure optimization:

* **Memory Management:** To stay under Render's **512MB RAM limit**, the environment is optimized with `TF_CPP_MIN_LOG_LEVEL=3` and restricted to a single worker to prevent OOM (Out-of-Memory) crashes during model loading.
* **CORS Handshaking:** Implemented a wildcard CORS policy in FastAPI to bridge the communication gap between the Vercel production frontend and the Render backend.
* **Monorepo Routing:** Configured custom Root Directories on both Vercel (`/frontend`) and Render (`/backend`) to maintain a clean project structure while ensuring successful build outputs.

---

## 💻 Local Setup (Arch Linux)

If you're running this on Arch, ensure you have the necessary build tools:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/rohan-shyam/Fin-TSP.git](https://github.com/rohan-shyam/Fin-TSP.git)
    cd Fin-TSP
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 📈 Roadmap
- [x] STFT Spectrogram Integration
- [x] CNN Model Training & Inference
- [x] Real-time NSE Ticker Search
- [x] Vercel & Render Production Deployment


**Author:** [Rohan Shyam](https://github.com/rohan-shyam)
