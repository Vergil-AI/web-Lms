<!-- STRUKTUR FOLDER V1 -->
Website-LMS-Altair-EDU/
├── app.py
├── config.py
├── extensions.py
├── create_db.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
├── run.py                    # Opsional: script startup
|
├── instance/
│   └── altair_edu.db        # Hanya satu file DB
|
├── migrations/              # Untuk Flask-Migrate
│   └── ...
|
├── models/
│   └── user.py
|
├── api/                     # Backend routing dan logic
│   ├── __init__.py
│   ├── auth.py
│   ├── badge.py
│   ├── dashboard.py
│   ├── guild.py
│   ├── leaderboard.py
│   ├── progress.py
│   ├── quest.py
│   └── services/            # Business logic jika dibutuhkan
│       └── progress_service.py
|
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── forgot_password.html
│   ├── includes/
│   │   ├── navbar.html
│   │   └── sidebar.html
│   ├── belajar/
│   │   ├── html/
│   │   ├── css/
│   │   ├── php/
│   │   └── javascript/
│   │       ├── pengenalan-javascript.html
│   │       ├── sintaks-dasar.html
│   │       └── ...
│   └── dashboard_user/
│       └── dashboard_section.html
|
├── assets/                  
│   ├── css/
│   │   ├── style.css
│   │   └── modul-js/
│   │       └── pengenalan.css
│   ├── js/
│   │   ├── gamifikasi.js
│   │   ├── dashboard.js
│   │   ├── auth.js
|   |   └── ...
│   │   └── ...
│   ├── images/
│   │   ├── icon-small/
│   │   └── ...
│   ├── gifs/
│   ├── fonts/
│   └── dist/                # Output dari bundling Vite
│       └── assets/
│           └── pengenalan-xxxx.js
|
├── frontend/                # Source bundler
│   └── js/
│       ├── pengenalan.js
│       └── utils/
│           └── validator.js
├── admin/                   # Khusus halaman admin
│   ├── add_modul.html
│   ├── add_quiz.html
│   └── admin_panel.html
├── ai_persona/             # AI asisten
│   ├── nova.html
│   ├── algoritmi.html
│   └── media/
├── list-progress/          # Dokumentasi perkembangan
│   └── 24-juni-2025.md
│   └── progress.md
|
├── references/             # Folder eksperimen
│   └── ...
├── node_modules/
├── package.json
├── package-lock.json
└── vite.config.js


<!-- STRUKTUR FOLDER V2 -->
/altair-edu/                      # Root folder proyek Altair Edu
│
├── .env                          # Environment variables (jangan di-commit) ✅
├── .gitignore                    # Abaikan file sensitif & sementara ✅
├── README.md                     # Dokumentasi umum proyek ✅
├── requirements.txt              # Daftar dependensi Python ✅
├── config.py                     # Konfigurasi global untuk Flask ✅
├── app.py                        # Entry point aplikasi Flask (atau manage.py untuk Django) ✅
│
├── templates/                    # Template HTML (Jinja2 untuk Flask/Django)
│   ├── base.html                 # Template dasar/layout
│   ├── index.html                # Halaman utama (landing) ✅
│   ├── about.html                # Tentang Altair Edu ✅
│   ├── contact.html              # Kontak & form feedback
│   ├── login.html                # Form login user ✅
│   ├── register.html             # Form registrasi user ✅
│   ├── gamifikasi.html           # Penjelasan sistem XP & badge
│   ├── dashboard/                # Template area dashboard user ✅
│   │   ├── index.html
│   │   ├── profile.html
│   │   ├── progress.html 
│   │   ├── leaderboard.html
│   │   ├── quest.html
│   │   ├── klan.html
│   │   ├── badge.html
│   │   ├── sertifikat.html
│   │   ├── notifikasi.html
│   │   └── settings.html
│   ├── belajar/                 # Template pembelajaran
│   │   ├── python.html
│   │   ├── math.html
│   │   ├── modul.html
│   │   ├── quiz_submit.html
│   │   └── sertifikat.html
│   ├── klan/
│   │   ├── klan.html
│   │   ├── view.html
│   │   └── leaderboard.html
│   ├── admin/                   # Template admin panel
│   │   ├── dashboard.html
│   │   ├── tambah_modul.html
│   │   ├── tambah_quiz.html
│   │   └── analytics.html
│   └── ai/
│       ├── nova.html
│       ├── algorhizmi.html
│
├── static/                      # Asset statis (CSS, JS, gambar)
│   ├── css/
│   │   ├── global.css
│   │   ├── dashboard.css
│   │   ├── progress.css
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── progress.js
│   │   ├── badge.js
│   │   ├── leaderboard.js
│   │   ├── quest.js
│   │   ├── guild.js
│   └── images/
│       ├── badge_icons/
│       └── guild_icons/
│
├── components/                  # Komponen HTML modular
│   ├── header.html
│   ├── footer.html
│   └── modul_card.html
│
├── includes/                    # JS utility functions
│   ├── config.js
│   ├── functions.js
│   └── xp_tracker.js
│
├── api/                         # API handler (Flask Blueprint / Django views)
│   ├── _init_.py
│   ├── auth.py
│   ├── dashboard.py
│   ├── progress.py
│   ├── badge.py
│   ├── leaderboard.py
│   ├── quest.py
│   └── guild.py
│
├── models/                      # Model database (ORM: SQLAlchemy/Django ORM)
│   ├── _init_.py
│   ├── user.py
│   ├── progress.py
│   ├── badge.py
│   ├── quest.py
│   └── guild.py
│
├── forms/                       # FlaskForm / Django Forms
│   └── auth_forms.py
│
├── middleware/                  # Middleware Python (auth, logging, dsb)
│   └── xp_logger.py
│
├── services/                    # Logika bisnis non-view (opsional)
│   └── auth_service.py
│
├── data/                        # File data dummy JSON
│   ├── modul.json
│   ├── user_progress.json
│   ├── badge.json
│   ├── quest.json
│   ├── klan.json
│   ├── leaderboard.json
│   └── users.json
│
├── tests/                       # Unit test aplikasi
│   ├── _init_.py
│   ├── test_auth.py
│   ├── test_dashboard.py
│   ├── test_progress.py
│   └── test_quest.py
│
├── uploads/                     # File upload user/admin
│
└── docs/                        # Dokumentasi teknis
    ├── setup.md
    ├── python_setup.md
    ├── database.md
    └── api_spec.md