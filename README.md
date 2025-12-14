1. Siapkan Juru Masak (Model ML)
   Ini adalah "Otak" yang menghitung rekomendasi untuk pelanggan.

Apa yang dilakukan: Masuk ke folder ml-lanjutan/, instal alat-alat Python (pip install), dan pastikan file modelnya sudah ada.

Alamatnya: Siapkan agar dia berjalan di port 5000.

Perintah Nyala: python app.py (di terminal 1).

2. Siapkan Dapur (Back-End)
   Ini adalah "Server" yang menyimpan data, mengurus login, dan menjadi penghubung antara Tampilan dan Juru Masak.

Apa yang dilakukan: Masuk ke folder backend/, instal alat-alatnya (npm install), dan siapkan database Anda agar struktur tabelnya lengkap (migrasi).

Alamatnya: Siapkan agar dia berjalan di port 8000. Anda juga harus memberitahunya bahwa Juru Masak ada di port 5000.

Perintah Nyala: npm start (di terminal 2).

3. Siapkan Kasir/Tampilan Depan (Front-End)
   Ini yang dilihat pengguna di browser.

Apa yang dilakukan: Masuk ke folder frontend/, instal alat-alat tampilan (npm install).

Alamatnya: Beri tahu dia bahwa Dapur (Server) ada di port 8000.

Perintah Nyala: npm run dev (di terminal 3).

VERIFIKASI AKHIR
Buka tiga jendela terminal dan jalankan ketiga perintah nyala di atas.

Buka browser Anda ke alamat http://localhost:3000.

Jika Anda bisa login, memasukkan data, dan mendapatkan rekomendasi, SELAMAT! Semua komponen sudah terhubung dengan sempurna.
