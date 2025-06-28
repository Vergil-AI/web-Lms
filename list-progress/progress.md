
# 📘 Dokumentasi Progress Proyek LMS AltairEdu — Dashboard Utama & Backend

## ✅ 1. Setup & Struktur Proyek
- [x] Struktur folder sudah rapi (`templates`, `static`, `models`, `api`, dll)
- [x] Virtual environment (`venv`) aktif & digunakan
- [x] Database SQLite: `altair_edu.db` sudah berjalan
- [x] Environment variable `.env` sudah digunakan

## ✅ 2. Model `User` (Tabel `users`)
- [x] Kolom identitas (`username`, `email`, `password`)
- [x] Data dashboard (`xp`, `level`, `streak`, `progress`, `last_module`, `active_quests`)
- [x] Kolom tambahan (`ranking`, `avatar_url`, `reset_token`, `created_at`)
- [x] Menggunakan `UserMixin` dari Flask-Login
- [x] Sudah terhubung dengan sistem login via `flask_login`

## ✅ 3. Model `UserModul` (Tabel `user_moduls`)
- [x] Dibuat class baru `UserModul` di `models/user.py`
- [x] Relasi `user_id` → ForeignKey ke `users.id`
- [x] Menyimpan data modul: `title`, `progress`, `link`
- [x] Ditambahkan `__repr__` agar mudah dibaca saat debug
- [x] Relasi ditambahkan ke `User` via `moduls = db.relationship(...)`

## ✅ 4. Migrasi Database dengan Flask-Migrate
- [x] `flask db migrate` dijalankan → perubahan model terdeteksi
- [x] `flask db upgrade` diterapkan → tabel baru `user_moduls` dibuat
- [x] Data tidak dihapus saat migrasi
- [x] Struktur database bisa diubah ke depannya tanpa `drop_all()`

## ✅ 5. Pengisian Data Awal via Flask Shell
- [x] Membuat user baru di `flask shell`
- [x] Menambahkan 1–2 modul aktif ke user melalui model `UserModul`
- [x] Verifikasi relasi `user.moduls` berjalan dengan benar

## ✅ 6. Routing & Logika Flask
- [x] Route `/dashboard` ditambahkan/diubah agar:
  - Menarik data `UserModul` dari database
  - Merender `dashboard.html` dengan `user_data`
- [x] Route `/register`, `/login`, `/profile` sudah ada & berjalan
- [x] Logout dengan POST (`/logout`)

## ✅ 7. HTML Dashboard Utama
- [x] Bagian `<section id="dashboard">` sudah dibuat dan terstruktur
- [x] Card “Modul Aktif” ditampilkan dengan loop:
  ```jinja
  {% for modul in user.current_modules %}
  ```
- [x] Menampilkan daftar modul, progress, dan link dinamis
- [x] Teks fallback jika belum ada modul (`Belum ada modul aktif`)

## ✅ 8. Testing & Validasi
- [x] Cek modul via `UserModul.query.all()`
- [x] Pastikan modul milik user tampil di dashboard
- [x] Cek login user yang sesuai dengan modul
- [x] Hard refresh + restart server jika perlu
