# Product Recommendation Model

Project ini merupakan **model Machine Learning untuk rekomendasi paket/produk telekomunikasi** berdasarkan pola penggunaan pelanggan.

## Dataset
Dataset berisi data penggunaan pelanggan seperti:
- Pemakaian data & video
- Durasi panggilan & SMS
- Pengeluaran bulanan
- Jenis paket & perangkat
- Target rekomendasi (`target_offer`)

## Tahapan Model
1. **Exploratory Data Analysis (EDA)**
   - Statistik deskriptif
   - Korelasi fitur
   - Distribusi numerik & kategorikal

2. **Preprocessing**
   - Handling missing value & duplikat
   - Scaling fitur numerik (MinMaxScaler)
   - Encoding fitur kategorikal (OneHotEncoder)
   - Encoding target (LabelEncoder)
   - Train-test split untuk menghindari data leakage

3. **Modeling**
   - Algoritma: **Gradient Boosting Classifier**
   - Evaluasi:
     - Accuracy
     - Classification Report
     - Confusion Matrix
     - Cross Validation (5-fold)

4. **Model Saving**
   - Model dan preprocessing disimpan menggunakan `joblib`

## Output File
- `model_offer.joblib` → Model Gradient Boosting
- `preprocessor_offer.joblib` → Preprocessing pipeline
- `encoder_offer.joblib` → Encoder target

## Library Utama
- pandas, numpy
- scikit-learn
- matplotlib, seaborn
- joblib

## Tujuan
Memberikan **rekomendasi paket yang lebih akurat dan efisien** berdasarkan data penggunaan pelanggan.

