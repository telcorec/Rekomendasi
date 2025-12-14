1. Siapkan Peralatan (Prasyarat & Kode)
   Pastikan ada: Node.js (untuk menjalankan kode), Git (untuk mengunduh), dan Server Database (tempat data).

Unduh Kode: Ambil semua file proyek dengan perintah git clone.

2. Siapkan Dapur (Back-End)
   Instal Bahan: Masuk ke folder backend/ dan pasang semua alat bantu (dependensi) dengan npm install atau yang serupa.

Siapkan Data: Pastikan database Anda hidup, buat nama database yang sesuai, lalu jalankan perintah migrasi agar struktur tabel siap.

Kunci Rahasia: Buat file .env di folder ini, yang berisi alamat dan kunci untuk mengakses database.

3. Nyalakan Tampilan (Front-End)
   Instal Tampilan: Masuk ke folder frontend/ dan instal alat-alat tampilan yang dibutuhkan.

Tahu Alamat Server: Buat file .env.local di sini, yang memberi tahu tampilan bahwa server (BE) berada di http://localhost:8000.

4. Jalankan!
   Buka dua terminal.

Terminal 1: Jalankan Back-End (npm start di folder backend/).

Terminal 2: Jalankan Front-End (npm run dev di folder frontend/).

Cek: Buka browser dan kunjungi alamat http://localhost:3000.
